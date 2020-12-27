
import React, { Component, Fragment, useState, useEffect, useLayoutEffect, useRef, useCallback, useContext } from 'react';
import Axios from 'axios';
import { XBASE_TEXT_PACK_API } from './network';
import moment from 'moment';

export const onDummyClick = function (e) {
    e.stopPropagation();
    console.log('globalVar', globalVar);
}
let globalVar = 0;
export default globalVar

export const USED_STATE_INDEX = 0;
export const USED_SET_STATE_INDEX = 1;

export const TITLE_FIRST_INPUT_OFFSET_Y = 180;
export const ADDRESS_FIRST_INPUT_OFFSET_Y = 260;
export const CATEGORY_FIRST_INPUT_OFFSET_Y = 180;
export const COMMON_LAST_INPUT_OFFSET_Y = 1000;

const textCache = { en: {}, de: {}, fr: {}, it: {} };

export function useTextPack({ language }, packageId) {
    const [textPack, setTextPack] = useState(null);
    useEffect(function () {
        console.log('/textPack useEffect ', packageId)
        if (textCache[language] && textCache[language][packageId]) {
            console.log('/textPack textCache used');
            setTextPack(textCache[language][packageId]);
        } else {
            Axios.get(XBASE_TEXT_PACK_API, { params: {id: packageId, lng: language }})
                .then(response => {
                    let keyTextMap = new Map();
                    if (response.data)
                        response.data.map(item => {
                            keyTextMap.set(item.key, item.text);
                        })
                    console.log('setTextPackId keyTextMap', keyTextMap)
                    textCache[language][packageId] = keyTextMap;
                    setTextPack(keyTextMap);
                })
                .catch(err => {
                    alert(err);
                    console.log('setTextPackId err', err)
                });
        }
    }, [language, packageId])
    console.log('language', language)
    return textPack;
}

export function trans(key, textPack) {
    return textPack && textPack.has(key) ? textPack.get(key) : key;
}

export function formatString(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, () => args[i++]);
}

export function formatDate(value) {
    return moment(new Date(value)).format("DD.MM.YYYY").toString();
}

export function formatNumber(value) {
    return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'") : "0";
}

export function parseZipCity(zipCity) {
    // if (location) {
    //     let locSegments = location.split(" ");
    //     if (locSegments.length >= 2) {
    //             zip = Number.parseInt(locSegments[isNaN(Number.parseInt(locSegments[0])) ?  locSegments.length - 1 : 0]);
    //     }
    // }
    let zip = null;
    let city = null;
    if (zipCity) {
        let locSegments = zipCity.split(" ");
        if (locSegments.length >= 2) {
            let zipString = locSegments[isNaN(Number.parseInt(locSegments[0])) ?  locSegments.length - 1 : 0];
            zip = Number.parseInt(zipString);
            city = locSegments.filter(item => item != zipString).join(" ");
        }else if(locSegments.length == 1) {
            let parseInt = Number.parseInt(locSegments[0]);
            zip = isNaN(parseInt) ? null : parseInt;
            city = isNaN(parseInt) ? locSegments[0] : null;
        }
    }
    return {zip, city};
}

export function useDocumentClientSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([document.documentElement.clientWidth, document.documentElement.clientHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

export function useWindowInnerSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}