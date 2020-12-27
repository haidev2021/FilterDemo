import React, { Component, Suspense, lazy, useState, useEffect, useLayoutEffect, useRef, useCallback, useContext, useMemo } from 'react';
import anibisLogo from './files/anibis-logo.svg';
import './root.css';
import './responsive.css';
import './base64.css';
import { BrowserRouter, HashRouter, Route, Link, Switch } from "react-router-dom";
import { useWindowInnerSize } from './utils/common';

const SearchResults = lazy(() => import('./screens/searchResults/searchResults'));

export const RootContext = React.createContext({ favoriteIds: ['1'] });
function Root(props) {
    const [width, height] = useWindowInnerSize();
    return <RootContext.Provider value={{isMobileSCreenSize: width < 1024,}}>
        <div id="root-container">
            <Suspense fallback={<div>Loading...</div>}>

                <Switch>
                    <Route exact path="/search"
                        render={(props) => (
                            <SearchResults> </SearchResults>
                        )}>
                    </Route>

                </Switch>
            </Suspense>

        </div>
    </RootContext.Provider>;
}

export default Root; 