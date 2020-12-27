import { Route, Switch, NavLink, Link } from 'react-router-dom'
import React, { Component, useState, useEffect, useLayoutEffect, useRef, useCallback, Fragment, useMemo, useContext } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import Axios from 'axios';
import FilterableList from '../../containers/filterableList/filterableList.js';
import { STATE_ACTIVE, STATE_DEACTAVATED, STATE_TO_APPROVE, STATE_BLOCKED } from '../../utils/advertState';
import { RootContext } from '../../root';
import { trans} from '../../utils/common.js';
import queryString from 'query-string';
import { ADVERT_SEARCH_API, ANIME_API } from '../../utils/network.js';
import { parseSearchQuery } from '../../utils/searchQueryHelper.js';

export default function SearchResults(props) {
    const {loginInfo, subCatMapRef, lng} = props;
    const rootContext = useContext(RootContext);
    const location = useLocation();

    const nocontent = useMemo(() => {
        return {
            title: trans("apps.noresults.createnotification", rootContext.commonTexts),
            description: trans("apps.noresults.createnotification.description", rootContext.commonTexts),
            buttonText: trans("apps.notification.enable", rootContext.commonTexts),
            onButtonClick: (e) => { },
        }
    }, [rootContext.commonTexts]);

    const query = location.search;
    const queryParsed = parseSearchQuery(query);
    console.log('prefilledCategory query queryParsed' , query, queryParsed)
    console.log('queryParsed.shortType', queryParsed.shortType)
    return <div className="my-adverts route-insert filterable-list-container with-nav consistent-padding">
        <FilterableList categoryFilter={queryParsed.categoryFilter} commonFilter={queryParsed.commonFilter} shortType={queryParsed.shortType || "title|descending"}
            isSearchAdvert={true} filterApi={ANIME_API} loginInfo={loginInfo}
            subCatMapRef={subCatMapRef} lng={lng} nocontent={nocontent}>
        </FilterableList>
    </div >
}