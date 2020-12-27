import { Route, Switch, NavLink, Link } from 'react-router-dom'
import React, { Component, useState, useEffect, useLayoutEffect, useRef, useCallback, Fragment, useContext, useMemo } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import "../../components/advertLists/style.css";
import "./style.css";
import Axios from 'axios';
import { useTextPack, trans, parseZipCity, formatString, useWindowInnerSize } from '../../utils/common';
import { RootContext } from '../../root';
import {
    ATTRIBUTE_ID_LIST, ATTRIBUTE_MULTIID_LIST, ATTRIBUTE_RANGE_LIST_DATE, ATTRIBUTE_RANGE_LIST_NUMBER,
    ATTRIBUTE_TEXT_LIST, CATEGORY_ID, encodeSubQuery, SEARCH_LOCATION, SEARCH_TERM, SORT_FIELD, SORT_ORDER, getCompoundQuery, updateSubQueryRef
} from '../../utils/searchQueryHelper';
import { TextSearch } from '../../components/textSearch/textSearch';
import { ADVERT_SEARCH_RESULT_API, ADVERT_SEARCH_COUNT_API } from '../../utils/network';
import { VerticalList } from '../../components/advertLists/list';
import { Filter } from '../filter/filter';
import { SortTypeSelector } from '../../components/sortTypeSelector/SortTypeSelector';
import Spinner from '../../components/spinner/Spinner';

const PAGE_SIZE = 20;
const ID_LIST_FETCHING = -1;
const DELAY_SEARCH_ON_KEYBOARD = 1500;
const DELAY_SEARCH_ON_MOUSE_OR_REFRESH = 200;

export const DUMMY_CATEGORY = { id: 0, name: "" };

export default function FilterableList(props) {

    const { appearAt, lng, filterApi, localAdvertIds, onRootSearchCountUpdate, commonFilter, shortType, loginInfo
        , categoryFilter, subCatMapRef, forFilterOnlyData, title, isSearchAdvert, children, onItemControllerClicks, nocontent, itemTextPack } = props;

    const rootContext = useContext(RootContext);
    const routerLocation = useLocation();
    const history = useHistory();
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [currentPageDetails, setCurrentPageDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState(null);
    const [commitSearchTerm, setCommitSearchTerm] = useState(null);
    const [sortType, setSortType] = useState("title|descending");
    const [categoryName, setCategoryName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [animes, setAnimes] = useState([]);
    const subQueriesRef = useRef({});
    const catAttCallbackRef = useRef(null);
    const previousSearchAdvertQueryRef = useRef(null);
    const appearAtHome = appearAt === "home";

    useEffect(() => {
        if (currentPageNumber !== ID_LIST_FETCHING) {
            let pageAnimes = animes ? animes.slice((currentPageNumber - 1) * PAGE_SIZE, currentPageNumber * PAGE_SIZE) : [];
            setCurrentPageDetails(pageAnimes);
            console.log('pageAnimes', pageAnimes)
        }
    }, [currentPageNumber, animes, lng]);

    const onTermChange = useCallback(function (e) {
        setSearchTerm(e.target.value);
    }, []);

    const fetchAdvertIds = useCallback((debugInfo) => {
        console.log('fetchAdvertIds debugInfo', debugInfo)
        const queryObject = getCompoundQuery(subQueriesRef.current);
        setTimeout(function () {
            let currentQueryObject = getCompoundQuery(subQueriesRef.current)
            if (queryObject.query === currentQueryObject.query && (!previousSearchAdvertQueryRef.current || queryObject.query !== previousSearchAdvertQueryRef.current.query)) {
                console.log(`prefilledCategory history.replace query ${filterApi}`, queryObject.query)
                history.replace({ pathname: routerLocation.pathname, search: '?' + queryObject.query });
                setCurrentPageNumber(ID_LIST_FETCHING);
                setIsLoading(true);
                const CORSURL = "https://cors-anywhere.herokuapp.com/";
                const getAnimesPath = CORSURL + filterApi + "?" + queryObject.query;
                console.log('ANIME_API getAnimesPath', getAnimesPath)
                Axios.get(getAnimesPath, {})
                    .then(function (response) {
                        console.log('ANIME_API', response)
                        let currentQueryObject2 = getCompoundQuery(subQueriesRef.current)
                        console.log('fetchAdvertIds ===', currentQueryObject.query === currentQueryObject2.query)
                        if (currentQueryObject.query === currentQueryObject2.query) {
                            const animes = response.data.results;
                            setAnimes(animes);
                            console.log('ANIME_API animes', animes)
                            setIsLoading(false);
                            setCurrentPageNumber(1);
                        }
                    })
                    .catch(function (error) {
                        console.log(`ANIME_API search  ${getAnimesPath} ERROR:`, error)
                    });
                previousSearchAdvertQueryRef.current = queryObject;
            }
            if (queryObject.query !== currentQueryObject.query) {
                console.log(`filter search  ${filterApi}`, 'not finish input yet....', queryObject.query, currentQueryObject.query)
            }
        }, previousSearchAdvertQueryRef.current && queryObject.keyBoardInputQuery !== previousSearchAdvertQueryRef.current.keyBoardInputQuery && !rootContext.isMobileSCreenSize
            ? DELAY_SEARCH_ON_KEYBOARD : DELAY_SEARCH_ON_MOUSE_OR_REFRESH);
    }, [filterApi, rootContext.isMobileSCreenSize, history, routerLocation.pathname]);

    const onSearchTextClick = useCallback(function (e) {
        setCommitSearchTerm(searchTerm);
    }, [searchTerm]);

    const onSortTypeSelect = useCallback(function (e) {
        setSortType(e.target.value)
    }, []);

    useEffect(() => {
        updateSubQueryRef(subQueriesRef, SEARCH_TERM, commitSearchTerm)
        fetchAdvertIds("searchTerm");
    }, [commitSearchTerm, fetchAdvertIds]);

    useEffect(() => {
        if (commonFilter.term) {
            setSearchTerm(commonFilter.term);
            setCommitSearchTerm(commonFilter.term);
        }
    }, [commonFilter.term])

    useEffect(() => {
        const [sf, so] = sortType.split("|");
        updateSubQueryRef(subQueriesRef, SORT_FIELD, sf);
        updateSubQueryRef(subQueriesRef, SORT_ORDER, so);
        fetchAdvertIds();
    }, [sortType, fetchAdvertIds]);

    useEffect(() => {
        if (shortType)
            setSortType(shortType);
    }, [shortType])

    const dummyCategory = useMemo(() => ({
        id: 0, name: "All genres"
    }), [])

    const onCategoryChange = useCallback((category, flushModalInputFlag) => {
        console.log('prefilledCategory onCategoryChange', category, flushModalInputFlag)
        category = category || dummyCategory;
        setCategoryName(category.name);
        updateSubQueryRef(subQueriesRef, CATEGORY_ID, category.id);
        if (flushModalInputFlag)
            fetchAdvertIds(CATEGORY_ID);
    }, [fetchAdvertIds, dummyCategory]);

    const onCategoryPathChange = useCallback((categoryPath, flushModalInputFlag) => {
        console.log('categoryPath', categoryPath)
    }, []);

    const onInputNumberChange = useCallback((map, flushModalInputFlag) => {
        console.log('FilterableList onInputNumberChange map', map)
        updateSubQueryRef(subQueriesRef, ATTRIBUTE_RANGE_LIST_NUMBER, map)
        if (flushModalInputFlag)
            fetchAdvertIds(ATTRIBUTE_RANGE_LIST_NUMBER);
    }, [fetchAdvertIds]);

    const onInputDateChange = useCallback((map, flushModalInputFlag) => {
        console.log('FilterableList onInputDateChange map', map)
        updateSubQueryRef(subQueriesRef, ATTRIBUTE_RANGE_LIST_DATE, map)
        if (flushModalInputFlag)
            fetchAdvertIds(ATTRIBUTE_RANGE_LIST_DATE);
    }, [fetchAdvertIds]);

    const onInputTextChange = useCallback((map, flushModalInputFlag) => {
        console.log('FilterableList onInputTextChange map', map)
        updateSubQueryRef(subQueriesRef, ATTRIBUTE_TEXT_LIST, map)
        if (flushModalInputFlag)
            fetchAdvertIds(ATTRIBUTE_TEXT_LIST);
    }, [fetchAdvertIds]);

    const onSingleEntrySelectChange = useCallback((map, flushModalInputFlag) => {
        console.log('FilterableList onSingleEntrySelectChange map', map, flushModalInputFlag)
        updateSubQueryRef(subQueriesRef, ATTRIBUTE_ID_LIST, map)
        if (flushModalInputFlag)
            fetchAdvertIds(ATTRIBUTE_ID_LIST);
    }, [fetchAdvertIds]);

    const onMultiEntrySelectChange = useCallback((map, flushModalInputFlag) => {
        console.log('FilterableList onMultiEntrySelectChange map', map)
        updateSubQueryRef(subQueriesRef, ATTRIBUTE_MULTIID_LIST, map)
        if (flushModalInputFlag)
            fetchAdvertIds(ATTRIBUTE_MULTIID_LIST);
    }, [fetchAdvertIds]);

    const pageCount = animes && Math.ceil(animes.length / PAGE_SIZE);

    const onFreviousPageClick = useCallback(function () {
        setCurrentPageNumber(currentPageNumber => currentPageNumber > 1 ? currentPageNumber - 1 : 1);
    }, []);

    const onNextPageClick = useCallback(function () {
        setCurrentPageNumber(currentPageNumber => currentPageNumber < pageCount ? currentPageNumber + 1 : currentPageNumber);
    }, [pageCount]);

    console.log('pageCount currentPageDetails', pageCount, animes)

    const onPageButtonClick = useCallback(function (e) {
        const clickData = Number.parseInt(e.target.getAttribute('clickData'));
        setCurrentPageNumber(clickData + 1)
    }, []);

    const pageNumClassName = "link-button material white page-number";

    function renderFilter(appearAt) {
        return <Filter
            editInputs={categoryFilter}
            commonFilter={commonFilter}
            catAttCallbackRef={catAttCallbackRef}
            subCatMapRef={subCatMapRef}
            lng={lng}
            appearAt={appearAt}
            isSearch={true}
            onCategoryChange={onCategoryChange}
            onCategoryPathChange={onCategoryPathChange}
            onInputNumberChange={onInputNumberChange}
            onInputDateChange={onInputDateChange}
            onInputTextChange={onInputTextChange}
            onSingleEntrySelectChange={onSingleEntrySelectChange}
            onMultiEntrySelectChange={onMultiEntrySelectChange}
            onXBaseAttributeChange={null}
            usedModelOpenState={forFilterOnlyData ? forFilterOnlyData.usedModelOpenState : null}
            onCategorySelected={forFilterOnlyData ? forFilterOnlyData.onCategorySelected : null}
        ></Filter>
    }
    function renderOnlyFilter() {
        return renderFilter("home")
    }
    console.log('isLoading', isLoading, currentPageDetails)

    function renderFullContent() {
        return <Fragment>
            <div className="filterable-list">
                <div className="filter-container">
                    <div id="text-search-mobile" className="res-b maxw1023 mt20">
                        <TextSearch value={searchTerm} onChange={onTermChange} onClick={onSearchTextClick}
                            btnText="Search"></TextSearch>
                    </div>
                    {renderFilter("search")}
                </div>
                <div id="filterable-list-horizontal-separator"></div>
                <div className="list-container">
                    <h1 id="result-count">{formatString(title || "%s animes found in %s", animes && animes.length, categoryName)}</h1>
                    {isSearchAdvert && <div id="search-list-header">
                        <div id="search-text-sort">
                            <div className="form-item res-b minw1024">
                                <label forhtml="contact-type">Keyword</label>
                                <TextSearch value={searchTerm} onChange={onTermChange} onClick={onSearchTextClick}
                                    btnText="Search"></TextSearch>
                            </div>
                            <div></div>
                            <div id="sort-item" className="form-item">
                                <label forhtml="sort-selector">Sort</label>
                                <SortTypeSelector value={sortType} onChange={onSortTypeSelect} isElevantAvailable={!!searchTerm}></SortTypeSelector>
                            </div>
                        </div>
                    </div>}
                    {children}

                    <div id="loading" style={{ display: isLoading ? 'block' : 'none' }}><Spinner></Spinner></div>

                    <div style={{ display: !isLoading ? 'block' : 'none' }}>
                        <VerticalList adverts={currentPageDetails} isSearchAdvert={isSearchAdvert} itemClass="material-bordered" loginInfo={loginInfo}
                            positionBase={(currentPageNumber - 1) * PAGE_SIZE} onItemControllerClicks={onItemControllerClicks} textPack={itemTextPack}></VerticalList>
                    </div>

                    <div className="page-navigator" style={{ display: animes && animes.length > 0 ? 'block' : 'none' }}>
                        <button className={pageNumClassName} disabled={currentPageNumber === 1}
                            onClick={onFreviousPageClick}><span className="backgrounded-span page-previous-icon before">
                                Back
                            </span></button>
                        {Array.from(Array(pageCount).keys()).map(number => {
                            return <button className={pageNumClassName} disabled={number === currentPageNumber - 1} clickData={number}
                                onClick={onPageButtonClick}>{number + 1}</button>
                        })}
                        <button className={pageNumClassName} disabled={currentPageNumber === pageCount} onClick={onNextPageClick}>
                            <span className="backgrounded-span page-next-icon after">
                                Next
                            </span></button>
                    </div>
                    <div style={{ display: !isLoading && animes && animes.length === 0 ? 'block' : 'none' }}>
                        <div id="no-content">
                            <div id="no-content-image">
                                <img src={require("../../files/no-results.png")} alt=""></img>
                            </div>
                            <div id="no-content-message">
                                <h3 className="mb12">{nocontent.title}</h3>
                                <span>{nocontent.description}</span>
                                <button className="link-button material lightgray large pw100 mt16" onClick={nocontent.onButtonClick}>{nocontent.buttonText}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </Fragment >
    }
    return appearAtHome ? renderOnlyFilter() : renderFullContent();
}