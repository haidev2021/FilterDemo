
import { Route, Switch, NavLink, Link } from 'react-router-dom'
import React, { Component, Fragment, useState, useEffect, useLayoutEffect, useRef, useCallback, useContext, useMemo } from 'react';
import CenterAnchoredModal from '../../../components/templates/centerAnchoredModal/centerAnchoredModal';
import './style.css';
export default function CategoryModal(props) {
    const { isOpen, onXClick, parentCats, subCats, onBottomButtonClick, searchCounts, onRootCategoryClick, onSubCategoryClick, bottomButtonText, hideBottomButton } = props;

    return <CenterAnchoredModal className="category-modal" isOpen={isOpen} onXClick={onXClick} onBottomButtonClick={onBottomButtonClick}
        bottomButtonText={bottomButtonText} hideBottomButton={hideBottomButton}>
        <ul className="category-list" >
            {parentCats.length === 0 && <h3>Genres A–Z</h3>}
            <li>
                <a href="/prevented" className={"simple-link" + (parentCats.length === 0 ? " secondary no-hover-color" : "")} onClick={onRootCategoryClick}>
                    All genres
                </a>
            </li>
            {/* <hr className="thin no-margin" /> */}
            {subCats.map(cat => {
                return <li clickData={cat.id}>
                    <a href="/prevented" clickData={cat.id} className="simple-link sub-category" onClick={onSubCategoryClick}>
                        <span clickData={cat.id}>
                            {cat.name} 
                            {/* ({cat.id}) */}
                            <span className="search-count" clickData={cat.id}>{searchCounts && searchCounts.get(cat.id)}</span>
                        </span>
                    </a>
                </li>
            })}
        </ul>
    </CenterAnchoredModal>
}