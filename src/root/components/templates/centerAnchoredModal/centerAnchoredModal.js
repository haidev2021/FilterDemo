
import { Route, Switch, NavLink, Link } from 'react-router-dom'
import React, { Component, Fragment, useState, useEffect, useLayoutEffect, useRef, useCallback, useContext } from 'react';
import Axios from 'axios';
import globalVar, { onDummyClick, trans } from '../../../utils/common';
import { RootContext } from '../../../root';

export default function CenterAnchoredModal(props) {
    let { isOpen, onXClick, onBottomButtonClick, bottomButtonText, hideBottomButton, children, className, smallMarginBottom } = props;
    const rootContext = useContext(RootContext);

    // useEffect(() => {
    //     console.log('useEffect pageYOffset set', window.pageYOffset)
    //     if (isOpen && rootContext.usedPageYOffset[0] !== null)
    //         rootContext.usedPageYOffset[1](window.pageYOffset);
    //     rootContext.usedDisableScrollY[1](isOpen);
    // }, [isOpen]);

    let texts = rootContext.commonTexts;
    onBottomButtonClick = onBottomButtonClick || onXClick;
    bottomButtonText = bottomButtonText || trans("apps.action.apply", texts);
    className = "modal-container " + className;

    return <div className={className} style={{ display: isOpen ? 'block' : 'none' }} onClick={onXClick}>
        <div className="modal-content center-anchored" onClick={onDummyClick}>

            <div className="modal-header">
                <button className="simple-link x-mark" onClick={onXClick}><span className="backgrounded-span close-icon after">Close</span></button>
            </div>

            <div className={"modal-chunk" + (hideBottomButton === true ? ' hide-bottom-button' : '')}>
                {children}
                {/* <div id="modal-footer-buffer"></div> */}
            </div>

            <div className="modal-footer" style={{ display: hideBottomButton === true ? 'none' : 'block' }}>
                <button className={"link-button non-material small blue match-parent-width" + (smallMarginBottom ? " small-margin" : "")} onClick={onBottomButtonClick}>{bottomButtonText}</button>
            </div>
        </div>
    </div>;
}