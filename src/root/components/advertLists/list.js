import { Route, Switch, NavLink, Link, useHistory, useLocation } from 'react-router-dom'
import React, { Component, Fragment, useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo, useContext } from 'react';
import "./style.css";
import { getStateText, getStateColor, STATE_ACTIVE, STATE_DEACTAVATED, STATE_TO_APPROVE } from '../../utils/advertState';
import Axios from 'axios';
import { formatDate, trans, useDocumentClientSize } from '../../utils/common';
import { RootContext } from '../../root';
import moment from 'moment';
import { ADVERT_SEARCH_RESULT_API } from '../../utils/network';
function useSlideToScroll(itemCount) {
    const [width, height] = useDocumentClientSize();
    const result = Math.min(Math.floor(width >= 1040 ? 4 : (width >= 600 ? (width - 16) / 244 : (width - 16) / 172)), itemCount);
    console.log('useSlideToScroll', `result=${result}`);
    return result;
}

const PAGE_SIZE = 20;
const ID_LIST_FETCHING = -1;

export function VerticalList(props) {
    const {adverts, itemClass, loginInfo, textPack} = props;
    return <div className={"vertical-list my-advert"}>
        <ul>
            {adverts && adverts.map((advert, index) => {
                return <li>
                    <AdvertItem className={"advert-item " + itemClass}
                        isVerticalList={true} loginInfo={loginInfo}
                        advert={advert} textPack={textPack}></AdvertItem>
                </li>
            })}
        </ul>
    </div>
}

// export function VerticalList(props) {
//     const {onItemControllerClicks, adverts, itemClass, loginInfo, textPack} = props;
//     console.log('render VerticalList', "vertical-list" + (onItemControllerClicks ? " my-advert" : ""))
//     return <div className={"vertical-list" + (onItemControllerClicks ? " my-advert" : "")}>
//         <ul>
//             {adverts && adverts.map((advert, index) => {
//                 return <li>
//                     <AdvertItem className={"advert-item " + itemClass}
//                         isVerticalList={true} loginInfo={loginInfo}
//                         advert={advert}
//                         onItemControllerClicks={onItemControllerClicks} textPack={textPack}></AdvertItem>
//                 </li>
//             })}
//         </ul>
//     </div>
// }

export function GridList(props) {
    const {adverts, itemClass} = props;
    console.log('render GridList')
    return <div className="grid-list">
        <ul>
            {adverts && adverts.map((advert, index) => {
                return <li>
                    <AdvertItem className={"noncard advert-item " + itemClass}
                        advert={advert}>
                    </AdvertItem>
                </li>
            })}
        </ul>
    </div>
}

function isAdminPage(loginInfo) {
    return loginInfo && loginInfo.role === "admin";
}

export function AdvertItem(props) {
    const { className, isVerticalList, loginInfo, advert, onItemControllerClicks, textPack } = props;
    const location = useLocation();
    const [controlShowed, setControlShowed] = useState(false);
    const history = useHistory();
    const rootContext = useContext(RootContext);
    console.log('AdvertItem textPack', textPack)

    const onAdvertClick = useCallback(
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('location', location)
            rootContext.detailPreviousPath.current = location.pathname + location.search;
            console.log('location detailPreviousPath', rootContext.detailPreviousPath.current);
            history.push("/detail/" + advert._id + (location.search || ""))
        }, [history, location, advert._id, rootContext.detailPreviousPath]);

    return <Link to="/detail" onClick={onAdvertClick}><div className={className}>
        <div className="info" style={{ marginLeft: controlShowed ? -150 : 0, position: 'relative' }}>
            {advert.image_url && <img className="thumb" src={advert.image_url} alt="."></img>}
            {!advert.image_url && <div className="thumb"></div>}
            <div className="texts">
                {isVerticalList && <div className="header">
                    <span className="address">{advert.type}</span>
                    <span className="separator">{"\u00B7"}</span>
                    <span className="category">{formatDate(advert.start_date)}</span>
                    <span className="separator">{"\u00B7"}</span>
                    <span className="posted">{formatDate(advert.end_date)}</span>
                    {/* {advert._id} */}
                </div>}
                <div className="title">{advert.title}</div>
                {isVerticalList && <li className="brief-description">{advert.synopsis}</li>}
                {/* <div className="price">{advert.url}</div> */}
                {<div className="footer">
                    <span>Airing: {advert.airing ? "Yes" : "No"}</span>
                    <span className="separator">{"\u00B7"}</span>
                    <span>Rated: {advert.rated}</span>
                    <span className="separator">{"\u00B7"}</span>
                    <span id="status-badge" style={{ backgroundColor: getStateColor(advert.state) }}>{advert.score}</span>
                </div>}
            </div>
        </div>
    </div></Link>
}