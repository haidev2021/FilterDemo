
import React from 'react';
import { AttributeSelect, AttributeInputText, AttributeSelectMulti, AttributeCheckMark, AttributeInputDate, AttributeInputNumber } from './attribute.js';
import moment from 'moment';

const AttType = Object.freeze({
    Undefined: 0, SelectSingle: 1, SelectMulti: 2,
    SelectMultiSearchSingle: 3, InputText: 4, InputTextSuggest: 5,
    InputInt: 6, InputDecimal: 7, InputDate: 8,
    Checkmark: 9, SelectSingleExt: 10, SelectSingleSearchMulti: 11,
});

export const INPUT_NUMBER = 0;
export const INPUT_DATE = 1;
export const ENTRY_ID = 2;
export const ENTRY_IDS = 3;
export const INPUT_TEXT = 4;
export const ATT_MAP_IDS = [0, 1, 2, 3, 4];
export default AttType;

function normaliseInteger(value) {
    let result = value ? Number.parseInt(value) : null;
    return result;
}

function normaliseFloat(value) {
    return value ? Number.parseFloat(value) : null;
}

export const attributeGetSetBase = [
    {
        get: (key = "inputNumber") => (item) => item && item[key],
        set: (key = "inputNumber") => (item, value, att) => { item[key] = (att.type === AttType.InputInt) ? normaliseInteger(value) : normaliseFloat(value) }
    },
    {
        get: (key = "inputDate") => (item) => item && moment(new Date(item[key])).format("YYYY-MM-DD").toString(),
        set: (key = "inputDate") => (item, value, att) => { item[key] = Date.parse(value); }
    },
    {
        get: (key = "attributeEntryId") => (item) => item && item[key],
        set: (key = "attributeEntryId") => (item, value, att) => { item[key] = (att.type === AttType.Checkmark) ? (value ? att.entries[0].id : null) : (value ? value : null) }
    },
    {
        get: (key = "attributeEntryIds") => (item) => item && item[key],
        set: (key = "attributeEntryIds") => (item, value, att) => { item[key] = Array.from(value.split(","), entry => Number.parseInt(entry)) }
    },
    {
        get: (key = "inputText") => (item) => item && item[key],
        set: (key = "inputText") => (item, value, att) => { item[key] = value }
    },];

export const attributeGetSets = Array.from(attributeGetSetBase, cbs => ({ get: cbs.get(), set: cbs.set() }));

const extractGetSet = ([index, key]) => ({ get: attributeGetSetBase[index].get(key), set: attributeGetSetBase[index].set(key) });

export const attributeFromGetSets = Array.from([[INPUT_NUMBER, "inputNumberFrom"], [INPUT_DATE, "inputDateFrom"]], extractGetSet);

export const attributeToGetSets = Array.from([[INPUT_NUMBER, "inputNumberTo"], [INPUT_DATE, "inputDateTo"]], extractGetSet);

export function isSelectType(type) {
    return type === 1 || type === 2 || type === 3 || type === 10 || type === 11;
}

export function isSelectMultiType(type) {
    return type === 2 || type === 3;
}

export const FORCE_SELECT_SINGLE = true;

export function getFilterAttributeMapId(attType) {
    if (FORCE_SELECT_SINGLE && isSelectType(attType)) {
        return ENTRY_ID;
    } else if (!FORCE_SELECT_SINGLE && isSelectMultiType(attType)) {
        return ENTRY_IDS;
    } else if (attType === AttType.Checkmark) {
        return ENTRY_ID;
    } else if (attType === AttType.InputDate) {
        return INPUT_DATE;
    } else if (attType === AttType.InputText || attType === AttType.InputTextSuggest) {
        return INPUT_TEXT;
    } else if (attType === AttType.InputInt || attType === AttType.InputDecimal) {
        return INPUT_NUMBER;
    }
}

export function getDetailAttributeValue(att, type, selectCb, mutilSelctCb, checkmarkCb, dateCb, textCb, numberCb) {
    if (FORCE_SELECT_SINGLE && isSelectType(type) && att.attributeEntryId)
        return selectCb();
    else if (!FORCE_SELECT_SINGLE && isSelectMultiType(type) && att.attributeEntryIds)
        return mutilSelctCb();
    else if (type === AttType.Checkmark && att.attributeEntryId)
        return checkmarkCb();
    else if (type === AttType.InputDate && att.inputDate)
        return dateCb();
    else if ((type === AttType.InputText || type === AttType.InputTextSuggest) && att.inputText)
        return textCb();
    else if ((type === AttType.InputInt || type === AttType.InputDecimal) && att.inputNumber > 0)
        return numberCb();
}

export function resolveAttribute(id, att, usedInputMaps, isSearch) {
    if (FORCE_SELECT_SINGLE && isSelectType(att.type)) {
        return resolveAttributeSelect(id, att, usedInputMaps[ENTRY_ID]);
    } else if (!FORCE_SELECT_SINGLE && isSelectMultiType(att.type)) {
        return resolveAttributeSelectMulti(id, att, usedInputMaps[ENTRY_IDS]);
    } else if (att.type === AttType.Checkmark) {
        return resolveAttributeCheckMark(id, att, usedInputMaps[ENTRY_ID]);
    } else if (att.type === AttType.InputDate) {
        return resolveAttributeInputDate(id, att, usedInputMaps[INPUT_DATE], isSearch);
    } else if (att.type === AttType.InputText || att.type === AttType.InputTextSuggest) {
        return resolveAttributeInputText(id, att, usedInputMaps[INPUT_TEXT]);
    } else if (att.type === AttType.InputInt || att.type === AttType.InputDecimal) {
        return resolveAttributeInputNumber(id, att, usedInputMaps[INPUT_NUMBER], isSearch);
    }
}

export function resolveIsAttributeButtonHasData(att, usedInputMaps) {
    if (att) {
        let attId = att.id;
        let mapId = getFilterAttributeMapId(att.type);
        let inputAtt = usedInputMaps[mapId][0].get(attId);
        let get = attributeGetSets[mapId] && attributeGetSets[mapId].get;
        let getFrom = attributeFromGetSets[mapId] && attributeFromGetSets[mapId].get;
        let getTo = attributeToGetSets[mapId] && attributeToGetSets[mapId].get;
        let result = get(inputAtt) || getFrom && getFrom(inputAtt) || getTo && getTo(inputAtt);
        return result;
    } else {
        return false;
    }
}

export function resolveAttributeButtonReset(att, usedInputMaps) {
    console.log('resolveAttributeButtonReset', att)
    if (att) {
        let attId = att.id;
        let mapId = getFilterAttributeMapId(att.type);
        let set = attributeGetSets[mapId] && attributeGetSets[mapId].set;
        let setFrom = attributeFromGetSets[mapId] && attributeFromGetSets[mapId].set;
        let setTo = attributeToGetSets[mapId] && attributeToGetSets[mapId].set;
        console.log('resolveAttributeButtonReset', mapId, usedInputMaps[mapId])
        const [inputMap, setInputMap] = usedInputMaps[mapId];
        var newInputMap = new Map(inputMap);
        set(newInputMap.get(attId), null, att);
        if (setFrom)
            setFrom(newInputMap.get(attId), null, att);
        if (setTo)
            setTo(newInputMap.get(attId), null, att);
        setInputMap(newInputMap);
    }
}

export function resolveAttributeSelect(id, att, usedInputMap) {
    return <AttributeSelect id={id} att={att} usedInputMap={usedInputMap} getSets={attributeGetSets[ENTRY_ID]}></AttributeSelect>
}

export function resolveAttributeSelectMulti(id, att, usedInputMap) {
    return <AttributeSelectMulti id={id} att={att} usedInputMap={usedInputMap} getSets={attributeGetSets[ENTRY_IDS]}></AttributeSelectMulti>
}

export function resolveAttributeCheckMark(id, att, usedInputMap) {
    return <AttributeCheckMark id={id} att={att} usedInputMap={usedInputMap} getSets={attributeGetSets[ENTRY_ID]}></AttributeCheckMark>
}

export function resolveAttributeInputText(id, att, usedInputMap) {
    return <AttributeInputText id={id} att={att} usedInputMap={usedInputMap} getSets={attributeGetSets[INPUT_TEXT]}></AttributeInputText>
}

export function resolveAttributeInputDate(id, att, usedInputMap, isFromTo) {
    if (isFromTo)
        return getFromToLayout(id,
            singleAttributeInputDate(id + "-from", att, usedInputMap, attributeFromGetSets[INPUT_DATE]),
            singleAttributeInputDate(id + "-to", att, usedInputMap, attributeToGetSets[INPUT_DATE]))
    else {
        return singleAttributeInputDate(id, att, usedInputMap, attributeGetSets[INPUT_DATE]);
    }
}

function singleAttributeInputDate(id, att, usedInputMap, getSets) {
    return <AttributeInputDate id={id} att={att} usedInputMap={usedInputMap} getSets={getSets}></AttributeInputDate>
}

export function resolveAttributeInputNumber(id, att, usedInputMap, isFromTo) {
    if (isFromTo)
        return getFromToLayout(id,
            singleAttributeInputNumber(id + "-from", att, usedInputMap, attributeFromGetSets[INPUT_NUMBER]),
            singleAttributeInputNumber(id + "-to", att, usedInputMap, attributeToGetSets[INPUT_NUMBER]))
    else {
        return singleAttributeInputNumber(id, att, usedInputMap, attributeGetSets[INPUT_NUMBER]);
    }
}

function singleAttributeInputNumber(id, att, usedInputMap, getSets) {
    return <AttributeInputNumber id={id} att={att} usedInputMap={usedInputMap} getSets={getSets}></AttributeInputNumber>
}

function getFromToLayout(id, from, to) {
    return <div id="from-to-attribute-container">
        <div id="from">  {from} </div>
        <div id="from-to-separator"></div>
        <div id="to"> {to} </div>
    </div>
}