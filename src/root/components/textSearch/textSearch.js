import { Route, Switch, NavLink, Link } from 'react-router-dom'
import React, { Component, useState, useEffect, useLayoutEffect, useRef, useCallback, Fragment, useContext } from 'react';
import Axios from 'axios';
import { useHistory } from "react-router-dom";
import { trans } from '../../utils/common';
export function TextSearch({value, onChange, onClick, btnText}) {
    return <div id="text-search">
        <input id="text-search-input" className="large" value={value} onChange={onChange}></input>
        <button id="text-search-button" className="link-button non-material large blue" onClick={onClick}><span>{btnText}</span></button>
    </div>
}