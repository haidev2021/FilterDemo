


import { Route, Switch, NavLink, Link } from 'react-router-dom'
import './style.css'
import React, { Component, Fragment, useState, useEffect, useLayoutEffect, useRef, useCallback, useContext, useMemo } from 'react';
import "../filter.css";
import { resolveIsAttributeButtonHasData, resolveAttributeButtonReset } from '../attribute/attributeFactory';
import { trans } from '../../../utils/common';

export function FilterButtons(props) {
    const {
        selectedCat, onCategoryClick, setSelectedCat, updateAttributeSection, pushCurrentFilterInput,
        setSingleFilterItemId, setFetchAdvertFlag, setMobileFilterOpen, setLocation, xBaseAttributes,
        usedInputMaps, commonTexts, textPack, location
    } = props;

    const onCategoryButtonClick = useCallback(e => {
        console.log('onCategoryButtonClick selectedCat', selectedCat)
        onCategoryClick(e, selectedCat);
        e.stopPropagation();
    }, [selectedCat, onCategoryClick])

    const onCategoryResetButtonClick = useCallback(e => {
        // fetchSubCategory(null, false);//to check if bugs
        setSelectedCat(null);
        updateAttributeSection(null, "onCategoryResetButtonClick");
        e.stopPropagation();
    }, [updateAttributeSection, setSelectedCat])//fetchSubCategory,

    const onFilterItemButtonClick = useCallback(e => {
        const clickData = e.target.getAttribute('clickData');
        console.log('onFilterItemButtonClick', clickData)
        pushCurrentFilterInput();
        switch (clickData) {
            case "city":
                setSingleFilterItemId("city");
                break;
            default:
                const id = clickData.split("-")[0];
                setSingleFilterItemId(id);
                break;
        }
        setFetchAdvertFlag(false);
        setMobileFilterOpen(true);
        e.stopPropagation();
    }, [pushCurrentFilterInput, setFetchAdvertFlag, setMobileFilterOpen, setSingleFilterItemId])

    const onFilterItemResetButtonClick = useCallback(e => {
        const clickData = e.target.getAttribute('clickData');
        switch (clickData) {
            case "city":
                // setSingleFilterItemId("city");
                setLocation("");
                e.stopPropagation();
                break;
            default:
                // setSingleFilterItemId(clickData);
                const [id, type] = clickData.split("-");
                if (id && type) {
                    resolveAttributeButtonReset({ id: Number.parseInt(id), type: Number.parseInt(type) }, usedInputMaps)
                    e.stopPropagation();
                }
                break;
        }
    }, [setLocation, usedInputMaps])

    const onAllFilterButtonClick = useCallback(e => {
        pushCurrentFilterInput();
        setSingleFilterItemId(null);
        setFetchAdvertFlag(false);
        setMobileFilterOpen(true);
        e.stopPropagation();
    }, [pushCurrentFilterInput, setFetchAdvertFlag, setMobileFilterOpen, setSingleFilterItemId])

    function renderResetableButton(clickData, label, hasData, onClick, onResetClick) {
        return <button clickData={clickData} className={"filter-button flat-button small " + (hasData ? "blue" : "white")} onClick={onClick}>
            {label}
            <div className="children-separator" style={{ display: !hasData ? 'none' : 'inline-block' }}></div>
            <button clickData={clickData} style={{ display: !hasData ? 'none' : 'inline-block' }} className="simple-link" onClick={onResetClick}>
                <span clickData={clickData} className="backgrounded-span white-close-icon before" onClick={onResetClick}></span>
            </button>
        </button>
    }

    return <ul id="mobile-filter-buttons" className="res-b maxw1023 mt20">

        {renderResetableButton("category", !selectedCat || !selectedCat.id ? "All genres" : selectedCat.name,
            selectedCat && selectedCat.id, onCategoryButtonClick, onCategoryResetButtonClick)}

        {xBaseAttributes.map(att => {
            let hasData = false;//resolveIsAttributeButtonHasData(att, usedInputMaps);
            return att && att.id !== 1 &&
                renderResetableButton(`${att.id}-${att.type}`, att.name, hasData, onFilterItemButtonClick, onFilterItemResetButtonClick)
        })
        }
        <button id="all-filters-button" className="flat-button small white" onClick={onAllFilterButtonClick}>
            <span className="backgrounded-span filter-icon before">All filter</span>
        </button>
    </ul>;
}