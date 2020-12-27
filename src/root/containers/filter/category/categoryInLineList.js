
import { Route, Switch, NavLink, Link } from 'react-router-dom'
import React, { Component, Fragment, useState, useEffect, useLayoutEffect, useRef, useCallback, useContext } from 'react';
import globalVar, { onDummyClick, trans } from '../../../utils/common';
import { RootContext } from '../../../root';
import { PRINT_DEBUG_INFO } from '../../../utils/config';
import './style.css';
export default function CategoryInLineList(props) {
    const { parentCats, subCats, searchCounts, onRootCategoryClick, onSubCategoryClick } = props;
    const rootContext = useContext(RootContext);
    let texts = rootContext.commonTexts;

    const printDebugInfo = useCallback(() => {
        if (PRINT_DEBUG_INFO)
            JSON.stringify(subCats);
    }, [subCats]);

    return <div>
        {printDebugInfo()}
        {<h3>Genres</h3>}
        <ul className="category-list inline" >
            <li className="mt12">
                <a href="/prevented" className={`simple-link  bold ${(parentCats.length === 0 && " secondary no-hover-color")}`} onClick={onRootCategoryClick}>
                    All genres
                </a>
            </li>
            <li></li>
            {subCats.map(cat => {
                return <li clickData={cat.id} >
                    <a clickData={cat.id} href="/prevented" className={`simple-link secondary no-hover-color sub-category${parentCats.length}`} onClick={onSubCategoryClick}>
                        {cat.name}
                        {/* ({cat.id}) */}
                        <span className="search-count" clickData={cat.id}>{searchCounts && searchCounts.get(cat.id)}</span>
                    </a>
                </li>
            })}
        </ul>
    </div>
}