
import { Route, Switch, NavLink, Link } from 'react-router-dom'
import lodash from 'lodash';
import React, { Component, Fragment, useState, useEffect, useLayoutEffect, useRef, useCallback, useContext, useMemo } from 'react';
import Axios from 'axios';
import "./filter.css";
import AttType, { isSelectType, isSelectMultiType, getFilterAttributeMapId, FORCE_SELECT_SINGLE, ENTRY_ID, ENTRY_IDS, INPUT_NUMBER, INPUT_TEXT, INPUT_DATE, ATT_MAP_IDS, resolveIsAttributeButtonHasData, resolveAttributeButtonReset } from './attribute/attributeFactory';
// import { InsertionContext, ValidationContext } from './insert';
import { CATEGORY_FIRST_INPUT_OFFSET_Y, formatString, trans, USED_SET_STATE_INDEX, USED_STATE_INDEX, useWindowInnerSize } from '../../utils/common';
import { XBASE_GET_SUBCATEGORIES_API, XBASE_GET_CATEGORY_PATH_BY_ID_API, XBASE_ATTRIBUTES_BY_CAT_ID_API } from '../../utils/network';
import CenterAnchoredModal from '../../components/templates/centerAnchoredModal/centerAnchoredModal';
import { LocationSearch } from './locationSearch';
import { RootContext } from '../../root';
import AttributeList from './attribute/attributeList';
import CategoryInLineList from './category/categoryInLineList';
import CategoryModal from './category/categoryModal';
import { FilterButtons } from './buttons/filterButtons';
import { ATTRIBUTES, GENRES } from '../../utils/animesBase';
export const FilterContext = React.createContext(null);
const FIXED_PRICE = 15218;
const DEFAULT_XBASE_ATTRIBUTES = [];
export function Filter(props) {
    const { editInputs,
        subCatMapRef,
        isSearch,
        appearAt,
        onCategoryChange,
        onCategoryPathChange,
        onInputNumberChange,
        onInputDateChange,
        onInputTextChange,
        onSingleEntrySelectChange,
        onMultiEntrySelectChange,
        onXBaseAttributeChange,
        textPack,
        usedModelOpenState,
        onCategorySelected,
        onLocationChange,
        searchCounts,
    } = props;

    const rootContext = useContext(RootContext);
    const [selectedCat, setSelectedCat] = useState(null);
    const [parentCats, setParentCats] = useState([]);
    const [subCats, setSubCats] = useState(GENRES);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [xBaseAttributes, setXBaseAttributes] = useState(ATTRIBUTES);
    // const entriedAttributeMapRef = useRef(null);
    const [singleFilterItemId, setSingleFilterItemId] = useState(null);
    const usedInputMaps = [useState(new Map()), useState(new Map()), useState(new Map()), useState(new Map()), useState(new Map())];
    const currentFilterInputMap = useRef([]);
    const [fetchAdvertFlag, setFetchAdvertFlag] = useState(true);
    const isSearchFlow = appearAt === "search";
    const isInsertFlow = appearAt === "insert";
    const isHomeFlow = appearAt === "home";
    const isMobileSCreenSize = rootContext.isMobileSCreenSize;
    const isSubCatInline = isSearchFlow && !isMobileSCreenSize;
    const commonTexts = rootContext.commonTexts;
    
    const pushCurrentFilterInput = useCallback(() => {
        console.log('pushCurrentFilterInput selectedCat', selectedCat)
        currentFilterInputMap.current.push({
            selectedCat: selectedCat,
            parentCats: parentCats,
            xBaseAttributes: xBaseAttributes,
            attributes: Array.from(ATT_MAP_IDS, id => lodash.cloneDeep(usedInputMaps[id][USED_STATE_INDEX]))
        });

    }, [parentCats, selectedCat, usedInputMaps, xBaseAttributes]);

    const popCurrentFilterInput = useCallback((clearTopOnly) => {
        console.log('popCurrentFilterInput', currentFilterInputMap.current)
        const topStack = currentFilterInputMap.current.pop();
        if (!clearTopOnly && topStack) {
            setSelectedCat(topStack.selectedCat);
            console.log('setSelectedCat 1', topStack.selectedCat)
            //setParentCats(topStack.parentCats);
            //setXBaseAttributes(topStack.xBaseAttributes);
            console.log('topStack.attributes[INPUT_NUMBER]', topStack.attributes[INPUT_NUMBER])
            topStack.attributes.map((item, index) => usedInputMaps[index][USED_SET_STATE_INDEX](item))
        }
    }, [usedInputMaps]);

    const catMapForClick = useMemo(() => {
        let result = new Map();
        if (parentCats && subCats)
            [...parentCats, ...subCats].map(item => {
                result.set(item.id, item);
            })
        console.log('catMapForClick useMemo', result)
        return result;
    }, [parentCats, subCats]);

    useEffect(() => {
        const fetchAdvertFlag = !isMobileSCreenSize || (!categoryModalOpen && !mobileFilterOpen);
        setFetchAdvertFlag(fetchAdvertFlag);
        if (!isMobileSCreenSize)
            setSingleFilterItemId(null);
    }, [isMobileSCreenSize, categoryModalOpen, mobileFilterOpen]);

    useEffect(() => {
        updateUsedInputMaps(xBaseAttributes);
        if (editInputs != null) {
            let categoryId = editInputs.categoryId;
            setSelectedCat(catMapForClick.get(categoryId));
        }
    }, [])

    const updateUsedInputMaps = useCallback(function (xBaseAttributes, toReset) {
        console.log('updateUsedInputMaps')
        // entriedAttributeMapRef.current = new Map();
        const newInputMaps = [new Map(), new Map(), new Map(), new Map(), new Map()];
        xBaseAttributes.map(att => {
            let mapToUse = newInputMaps[getFilterAttributeMapId(att.type)];
            let editInput = editInputs && editInputs.attributes && editInputs.attributes.find(detailAtt => att.id === detailAtt.attributeId);
            console.log('updateUsedInputMaps editInput', editInput)
            let defaultInput = {
                attributeId: att.id,
                attributeEntryIds: isInsertFlow && isSelectType(att.type) && att.defaultSelectItemId ? [att.defaultSelectItemId] : null,
                attributeEntryId: isInsertFlow && isSelectType(att.type) ? att.defaultSelectItemId : null,
                inputText: null,
                inputNumber: null,
                inputDate: '',//'2020-10-15'
            }
            mapToUse.set(att.id, editInput && !toReset || defaultInput);
        });
        console.log('newInputMaps', newInputMaps)
        ATT_MAP_IDS.map(item => {
            usedInputMaps[item][USED_SET_STATE_INDEX](newInputMaps[item]);
        })
    }, [editInputs, isInsertFlow, usedInputMaps])
    
    const resetFilter = useCallback(() => {
        updateUsedInputMaps(xBaseAttributes, true);
    },[updateUsedInputMaps, xBaseAttributes]);

    useEffect(() => {
        if (usedModelOpenState && usedModelOpenState[USED_STATE_INDEX]) {
            setCategoryModalOpen(usedModelOpenState[USED_STATE_INDEX]);
            //fetchSubCategory(null);
            usedModelOpenState[USED_SET_STATE_INDEX](false);
        }
    }, [usedModelOpenState && usedModelOpenState[USED_STATE_INDEX], usedModelOpenState]);

    const onCategoryClick = useCallback(function (e, cat) {
        console.log('onCategoryClick', cat)
        e.preventDefault();
        e.stopPropagation();
        setSelectedCat(cat);
        console.log('setSelectedCat 3', cat)
        setCategoryModalOpen(categoryModalOpen => !categoryModalOpen);
    }, []);

    const onRootCategoryClick = useCallback((e) => {
        onCategoryClick(e, null);
    }, [onCategoryClick]);

    const onSubCategoryClick = useCallback((e) => {
        const id = e.target.getAttribute('clickData');
        console.log('catMapForClick onCategoryClick id', id)
        console.log('catMapForClick onCategoryClick', catMapForClick.get(Number.parseInt(id)))
        onCategoryClick(e, catMapForClick.get(Number.parseInt(id)));
    }, [onCategoryClick, catMapForClick]);

    const entryIdAttMap = usedInputMaps[ENTRY_ID][USED_STATE_INDEX];
    const entryIdsAttMap = usedInputMaps[ENTRY_IDS][USED_STATE_INDEX];
    const inputNumberAttMap = usedInputMaps[INPUT_NUMBER][USED_STATE_INDEX];
    const inputTextAttMap = usedInputMaps[INPUT_TEXT][USED_STATE_INDEX];
    const inputDateAttMap = usedInputMaps[INPUT_DATE][USED_STATE_INDEX];

    useEffect(() => {
        if (onCategoryChange) {
            console.log('prefilledCategory onCategoryChange selectedCat', selectedCat)
            onCategoryChange(selectedCat, fetchAdvertFlag);
        }
    }, [onCategoryChange, selectedCat, fetchAdvertFlag])

    useEffect(() => {
        if (onCategoryPathChange) {
            onCategoryPathChange(parentCats, fetchAdvertFlag);
        }
    }, [onCategoryPathChange, parentCats, fetchAdvertFlag])

    useEffect(() => {
        if (onSingleEntrySelectChange) {
            onSingleEntrySelectChange(entryIdAttMap, fetchAdvertFlag);
        }
    }, [onSingleEntrySelectChange, entryIdAttMap, fetchAdvertFlag])

    useEffect(() => {
        if (onMultiEntrySelectChange) {
            onMultiEntrySelectChange(entryIdsAttMap, fetchAdvertFlag);
        }
    }, [onMultiEntrySelectChange, entryIdsAttMap, fetchAdvertFlag])

    useEffect(() => {
        if (onInputNumberChange) {
            onInputNumberChange(inputNumberAttMap, fetchAdvertFlag);
        }
    }, [onInputNumberChange, inputNumberAttMap, fetchAdvertFlag])

    useEffect(() => {
        if (onInputTextChange) {
            onInputTextChange(inputTextAttMap, fetchAdvertFlag);
        }
    }, [onInputTextChange, inputTextAttMap, fetchAdvertFlag])

    useEffect(() => {
        if (onInputDateChange) {
            onInputDateChange(inputDateAttMap, fetchAdvertFlag);
        }
    }, [onInputDateChange, inputDateAttMap, fetchAdvertFlag])

    useEffect(() => {
        if (onXBaseAttributeChange)
            onXBaseAttributeChange(xBaseAttributes);
    }, [onXBaseAttributeChange, xBaseAttributes])

    const onMobileFilterBottomButtonClick = useCallback(e => {
        console.log('onMobileFilterBottomButtonClick')
        popCurrentFilterInput(true);
        setMobileFilterOpen(false);
        setFetchAdvertFlag(true);
        e.stopPropagation();
    }, [popCurrentFilterInput])

    const onMobileFilterCancelClick = useCallback(e => {
        popCurrentFilterInput();
        setMobileFilterOpen(false);
        e.stopPropagation();
    }, [popCurrentFilterInput])

    const updateSelectedCatFromModal = useCallback(() => {
        popCurrentFilterInput(true);
        setCategoryModalOpen(false);
        let cat = parentCats.length > 0 ? parentCats[parentCats.length - 1] : null;
        console.log('updateSelectedCatFromModal setSelectedCat', cat)
        setSelectedCat(cat);
        console.log('setSelectedCat 4', cat)
        if (onCategorySelected)
            onCategorySelected(cat);
        console.log("onCategoryModalCancelClick", isMobileSCreenSize);
        if (isMobileSCreenSize)
            setFetchAdvertFlag(!mobileFilterOpen);
    }, [isMobileSCreenSize, mobileFilterOpen, onCategorySelected, parentCats, popCurrentFilterInput]);

    useEffect(() => {
        if (isInsertFlow && parentCats.length > 0 && subCats.length === 0 &&
            selectedCat !== parentCats[parentCats.length - 1]) {
            updateSelectedCatFromModal();
        }
    }, [parentCats, subCats, isInsertFlow, selectedCat, updateSelectedCatFromModal]);

    console.log('render', "Filter AttributeInputText");

    const onCategoryModalCancelClick = useCallback(e => {
        e.stopPropagation();
        setCategoryModalOpen(false);
        popCurrentFilterInput();
    }, [popCurrentFilterInput])

    function renderCategorySelector() {
        if (!isSubCatInline) {
            const display = !isHomeFlow && !singleFilterItemId ? 'block' : 'none';
            return <Fragment>
                <div className="category-selector" style={{ display: display }}>
                    {!selectedCat &&
                        <label>Genre
                            <span id="mandatory-mark">{editInputs != null ? "*" : ""}</span>
                        </label>}
                    <ul className={"category-path isMandatory"  + (!selectedCat ? " empty" : "")} id="filter-root-category">
                        <li>
                            <a href="/prevented" className="simple-link" id={0} onClick={onRootCategoryClick}>
                                {"All genres"}
                            </a>
                        </li>
                        {selectedCat && parentCats.map((cat, index) => {
                            let className = "simple-link secondary" + (selectedCat === cat ? " bold" : "") + " sub-category" + " level" + index;
                            return <li clickData={cat.id}>
                                <a href="/prevented" clickData={cat.id} className={className} onClick={onSubCategoryClick}>{cat.name}
                                    ({cat.id})
                                    <span className="search-count" clickData={cat.id}>{searchCounts && searchCounts.get(cat.id)}</span>
                                </a>
                            </li>
                        })}
                    </ul>
                </div>
            </Fragment>
        }
        else
            return <CategoryInLineList onXClick={onCategoryModalCancelClick} parentCats={parentCats} subCats={subCats}
                onItemClick={onCategoryClick} onBottomButtonClick={updateSelectedCatFromModal} searchCounts={searchCounts}
                catMapForClick={catMapForClick} onRootCategoryClick={onRootCategoryClick} onSubCategoryClick={onSubCategoryClick}></CategoryInLineList>
    }

    function notifyRenderAllFiltersContent() {
        if (isSearchFlow && isMobileSCreenSize)
            return <CenterAnchoredModal className="all-filters" isOpen={mobileFilterOpen}
                onXClick={onMobileFilterCancelClick} onBottomButtonClick={onMobileFilterBottomButtonClick}
                bottomButtonText="Apply" smallMarginBottom={true}> 
                {renderAllFiltersContent()}
            </CenterAnchoredModal>
        else
            return renderAllFiltersContent()
    }
    console.log('isMobileSCreenSize', isMobileSCreenSize)
    function renderAllFiltersContent() {
        const headerDisplay = singleFilterItemId ? 'none' : 'flex';
        return <div id="all-filters-container" className="" style={singleFilterItemId ? { marginTop: -20 } : {}}>
            {renderCategorySelector()}
            {(isSearchFlow || isInsertFlow) && (xBaseAttributes.length > 0) && <div className="attributes">
                <hr className="thick no-margin" style={{ display: headerDisplay }} />
                <div className="header" style={{ display: headerDisplay }}>
                    <h3 className="title">Filter</h3>
                    <button className="simple-link reset-attribute" onClick={resetFilter}>Reset</button>
                </div>
                <AttributeList xBaseAttributes={xBaseAttributes} usedInputMaps={usedInputMaps} singleFilterItemId={singleFilterItemId}>
                </AttributeList>
                <div className="mt20"></div>
            </div>}
        </div>
    }

    return <Fragment>
        <FilterContext.Provider value={{ isSearch: isSearch, categoryId: selectedCat ? selectedCat.id : 0, textPack: textPack }}>
            {/* {JSON.stringify(searchCounts)} */}
            {isSearchFlow && <FilterButtons
                selectedCat={selectedCat}
                onCategoryClick={onCategoryClick}
                setSelectedCat={setSelectedCat}
                pushCurrentFilterInput={pushCurrentFilterInput}
                setSingleFilterItemId={setSingleFilterItemId}
                setFetchAdvertFlag={setFetchAdvertFlag}
                setMobileFilterOpen={setMobileFilterOpen}
                xBaseAttributes={xBaseAttributes}
                usedInputMaps={usedInputMaps}
                commonTexts={commonTexts}
                textPack={textPack}
            ></FilterButtons>}

            {notifyRenderAllFiltersContent()}

            <CategoryModal isOpen={!isSubCatInline && categoryModalOpen}
                onXClick={onCategoryModalCancelClick}
                parentCats={parentCats}
                subCats={subCats}
                onBottomButtonClick={updateSelectedCatFromModal}
                searchCounts={searchCounts}
                onRootCategoryClick={onRootCategoryClick}
                onSubCategoryClick={onSubCategoryClick}
                bottomButtonText="Apply"
                hideBottomButton={isInsertFlow && subCats.length > 0}
            ></CategoryModal>

        </FilterContext.Provider>
    </Fragment >;
}