
import { Route, Switch, NavLink, Link } from 'react-router-dom'
import React, { Component, Fragment, useState, useEffect, useLayoutEffect, useRef, useCallback, useContext } from 'react';
import Axios from 'axios';
import AttType, { isSelectType, FORCE_SELECT_SINGLE, ENTRY_ID, ENTRY_IDS, INPUT_TEXT, INPUT_NUMBER, INPUT_DATE, resolveAttributeCheckMark, resolveAttributeInputDate, resolveAttributeInputNumber, resolveAttributeInputText, resolveAttributeSelect, resolveAttributeSelectMulti, resolveAttribute, resolveAttributeButtonReset } from './attributeFactory';
// import { InsertionContext } from './insert';
import { FilterContext } from '../filter';

function isSearchFromTo(att) {
    return att.type === AttType.InputDate || att.type === AttType.InputInt || att.type === AttType.InputDecimal;
}

export default function AttributeList({ children: commonAttItem, xBaseAttributes, usedInputMaps, singleFilterItemId }) {
    const filterContext = useContext(FilterContext);

    const isGeneralFilterOnTop = !xBaseAttributes.find(att => att.id === 1);
    const isSearch = filterContext.isSearch;
    const commonFilterDisplay = !singleFilterItemId || "city" === singleFilterItemId ? 'block' : 'none';
    const resetCommonFilterDisplay = singleFilterItemId && commonFilterDisplay === 'block' ? 'block' : 'none';

    function getcommonAttItem() {
        return <div style={{ display: commonFilterDisplay }}>
            {commonAttItem}
            <button id="reset-single-attribute" className="simple-link reset-attribute" style={{ display: resetCommonFilterDisplay }}>
                Reset
            </button>
        </div>
    }
    const onAttributeResetButtonClick = useCallback(e => {
        e.preventDefault();
        console.log('onAttributeResetButtonClick e.target', e.target)
        console.log('onAttributeResetButtonClick e.target.data', e.target.getAttribute('data'))
        const [id, type] = e.target.getAttribute('data').split("-");
        if (id && type) {
            resolveAttributeButtonReset({ id: Number.parseInt(id), type: Number.parseInt(type) }, usedInputMaps)
        }
        e.stopPropagation();
    }, [usedInputMaps])

    return <ul>
        {isGeneralFilterOnTop && getcommonAttItem()}
        {xBaseAttributes.map(att => {
            const id = filterContext.categoryId + "-" + att.id + "-" + (isSearch ? "search" : "insert");
            const attDisplay = !singleFilterItemId || att.id == singleFilterItemId ? 'block' : 'none';
            const resetButtonDisplay = singleFilterItemId && attDisplay === 'block' ? 'block' : 'none';
            return <Fragment><li id={id} className="form-item" style={{ display: attDisplay }}>
                <label className="attribute" forhtml={att.name}>
                    {att.name}
                    {!isSearch && <span id="mandatory-mark">{att.isMandatory ? "*" : ""}</span>}
                    {isSearch && <span id="from-to-text">
                        {isSearchFromTo(att) ? "Start - End" : ""}
                    </span>}
                    {/* {PRINT_DEBUG_INFO && `[${att.id}]`} */}
                </label>
                {resolveAttribute(id, att, usedInputMaps, isSearch)}

                <button id="reset-single-attribute" data={`${att.id}-${att.type}`} onClick={onAttributeResetButtonClick} className="simple-link reset-attribute" style={{ display: resetButtonDisplay }}>
                    Reset
                </button>
            </li>

                {!isGeneralFilterOnTop && att.id === 1 && getcommonAttItem()}
            </Fragment>
        })}
    </ul>
}
