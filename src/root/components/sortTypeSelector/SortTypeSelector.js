import { Route, Switch, NavLink, Link } from 'react-router-dom'
import React, { Component, useState, useEffect, useLayoutEffect, useRef, useCallback, Fragment, useContext } from 'react';
import Axios from 'axios';
import { useHistory } from "react-router-dom";
import { trans } from '../../utils/common';
import { SORT_TYPES } from '../../utils/animesBase';
export function SortTypeSelector({ value, onChange, textPack, isElevantAvailable }) {
    return <select id="sort-selector" className="large" value={value} onChange={onChange}>
        {SORT_TYPES.map(item => {
            return  <option value={item.id}>{item.name}</option>
        })}
    </select>
}