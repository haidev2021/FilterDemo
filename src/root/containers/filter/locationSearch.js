import { Route, Switch, NavLink, Link } from 'react-router-dom'
import React, { Component, useState, useEffect, useLayoutEffect, useRef, useCallback, Fragment, useContext } from 'react';
import Axios from 'axios';
import { XBASE_LOCATION_SUGGESTION_API } from '../../utils/network';
import { RootContext } from '../../root';
import { trans } from '../../utils/common';
function toTitleCase(str) {
    return str.split(' ')
        .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(' ')
}

export function getInputClassName(value, isValidating, isMandatory) {
    let className = "large" + (value ? " filled" : " empty") + (isValidating ? " isValidating" : "") + (isMandatory ? " isMandatory" : "");
    console.log('className', className)
    return className;
}

export function LocationSearch(props) {
    const {onChange, value, isSearch} = props;
    const rootContext = useContext(RootContext);
    const [locationSuggestions, setLocationSuggestions] = useState(null);
    const [location, setLocation] = useState(null);
    const locationRef = useRef(null);

    const onSuggestionClick = useCallback(e => {
        const loc = e.target.getAttribute('clickData')
        setLocation(loc);
        onChange(loc);
        setLocationSuggestions(null);
    }, [onChange]);

    useEffect(() => {
        setLocation(value);
    }, [value])

    const onLocationChange = useCallback(e => {
        console.log('onLocationChange', e.target.value)
        setLocation(e.target.value);
        locationRef.current = e.target.value;
        const requestTrigger = e.target.value;
        if (!requestTrigger) {
            setLocationSuggestions(null);
            onChange(null);
        } else {
            setTimeout(function () {
                console.log('locationSuggestion requestTrigger', requestTrigger, "location", location)
                console.log('LocationSearch language', rootContext.language)
                if (locationRef.current === requestTrigger)
                    Axios.get(XBASE_LOCATION_SUGGESTION_API, {
                        params: {language: rootContext.language, prefix: requestTrigger,}
                    })
                        .then(function (response) {
                            console.log(`POST /locationSuggestion RESPONSE = `, response.data);
                            let fixedCase = [];
                            if (response.data)
                                fixedCase = Array.from(response.data, item => toTitleCase(item));
                            setLocationSuggestions(fixedCase);
                        })
                        .catch(function (error) {
                            console.log(`POST /locationSuggestion ERROR:`, error);
                        });
            }, 750);
        }
    }, [location, onChange, rootContext.language]);

    let label = <label forhtml="contact-type">{trans("apps.advertcity", rootContext.commonTexts)}</label>;
    let inputClassName = isSearch ? "large" : getInputClassName(!location ? value : location, false, true);

    return <div className="form-item p-relative">
        {label}
        <input className={inputClassName} value={location} onChange={onLocationChange} autocomplete="off"></input>
        <div className="dropdown-content" id="location-suggestions" style={{ display: locationSuggestions ? 'block' : 'none' }}>
            {locationSuggestions && locationSuggestions.map(item => <span className="simple-link" clickData={item} onClick={onSuggestionClick}>
                {item.substring(0, location.length)}<span className="suggestion-non-prefix" clickData={item} >{item.substring(location.length, item.length)} </span>
            </span>)}
        </div>
    </div>
}