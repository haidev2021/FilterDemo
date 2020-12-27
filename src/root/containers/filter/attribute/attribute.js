import { Route, Switch, NavLink, Link } from 'react-router-dom'
import React, { Component, Fragment, useState, useEffect, useLayoutEffect, useRef, useCallback, useContext } from 'react';
import { RootContext } from '../../../root';

function getValueFromDom(event) {
    console.log('getValueFromDom event.target.value', event.target.value)
    return event.target.type === "checkbox" ? event.target.checked : event.target.value;
}

export function getInputClassName(value, isValidating, isMandatory) {
    let className = "large" + (value ? " filled" : " empty") + (isValidating ? " isValidating" : "") + (isMandatory ? " isMandatory" : "");
    console.log('className', className)
    return className;
}

function useInputMapExtractor(att, usedInputMap, initValue, { get, set }) {
    const ref = useRef(null);
    const rootContext = useContext(RootContext);
    const [inputMap, setInputMap] = usedInputMap;
    const value = get(inputMap.get(att.id)) || initValue;
    const className = getInputClassName(value, false, att.isMandatory); 

    const onValueChange = useCallback(e => {
        const newValue = getValueFromDom(e);
        console.log('newValue inputMap', newValue, inputMap)
        var newInputMap = new Map(inputMap);
        set(newInputMap.get(att.id), newValue, att);
        setInputMap(newInputMap);
        console.log('newInputMap', newInputMap.get(att.id))

    }, [inputMap, setInputMap, att, set]);

    return [value, onValueChange, ref, className, rootContext];
}

export function AttributeInputText({id, att, usedInputMap, getSets}) {
    const [value, onValueChange, ref, className, rootContext] = useInputMapExtractor(att, usedInputMap, "", getSets);
    return <input ref={ref} id={id} type="number" className={className} placeholder=" " onChange={onValueChange} value={value}
        required={att.isMandatory}></input>
}

export function AttributeSelect({id, att, usedInputMap, getSets}) {
    const [value, onValueChange, ref, className, rootContext] = useInputMapExtractor(att, usedInputMap, "", getSets);
    console.log('AttributeSelect usedInputMap', usedInputMap[0])
    return <select ref={ref} id={id} placeholder=" " className={className} onChange={onValueChange} value={value}>
        {<option selected value={""} >Any</option>}
        {att.entries && att.entries.map(entry => {
            console.log('AttributeSelect entry.attributeEntryId', entry.attributeEntryId)
            let optionId = id + "-" + entry.id;
            return <option id={optionId} value={entry.attributeEntryId}>{entry.name}</option>
        })}
    </select>
}

export function AttributeSelectMulti({id, att, usedInputMap, getSets}) {
    const [value, onValueChange, ref, className, rootContext] = useInputMapExtractor(att, usedInputMap, "", getSets);
    return <select ref={ref} id={id} className={className} multiple onChange={onValueChange} value={value}>
        {<option selected value={""}>Any</option>}
        {att.entries && att.entries.map(entry => {
            let optionId = id + "-" + entry.id;
            return <option id={optionId} value={entry.id}>[X] {entry.name}</option>
        })}
    </select>
}

export function AttributeCheckMark({id, att, usedInputMap, getSets}) {
    const [value, onValueChange, ref, className, rootContext] = useInputMapExtractor(att, usedInputMap, false, getSets);
    return <label className="checkbox" forHtml={id}>
        <input ref={ref} id={id} type="checkbox" name="" onChange={onValueChange} checked={value} />
        {att.name}</label>
}

export function AttributeInputDate({id, att, usedInputMap, getSets}) {
    const [value, onValueChange, ref, className, rootContext] = useInputMapExtractor(att, usedInputMap, "", getSets);
    return <input ref={ref} id={id} className={className} placeholder=" " type="date" onChange={onValueChange} value={value} />
}

export function AttributeInputNumber({id, att, usedInputMap, getSets}) {
    const [value, onValueChange, ref, className, rootContext] = useInputMapExtractor(att, usedInputMap, "", getSets);
    // let range = att.numericRange;
    // let max = range.maxValue;
    // let min = range.minValue;
    // let step = range.stepValue;
    // if (range && (max - min) / step <= 100) {
    //     let optValue = min;
    //     let options = [];
    //     for (; optValue <= max; optValue += step) {
    //         let optionId = id + "-" + optValue;
    //         options.push(<option id={optionId} value={optValue}>{optValue + (" " + att.unit).trim()} </option>);
    //     }
    //     return <select ref={ref} id={id} className={className} onChange={onValueChange} value={value}>
    //         {<option value="">Any</option>}
    //         {options}</select>
    // }
    // else {
        //step={step} min={min} max={max} 
        return <input ref={ref} placeholder=" " id={id} className={className} type="number" onChange={onValueChange} value={value}></input>
    // }
}