import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PageStateContext = createContext();

const PageStateProvider = ({ children }) => {
    const [pageState, setPageState] = useState({ currentPage: null, currentFolder: null, theme: 'light', viewMode: null, toUpdate: null, folderTree: [] });
    const navigate = useNavigate();
    const loc = useLocation();
    const tabId = getTabId();

    function getTabId() {
        let tabId = sessionStorage.getItem('tabId');
        if (!tabId) {
            tabId = crypto.randomUUID();
            sessionStorage.setItem('tabId', tabId);
        }
        return tabId;
    }

    const toggleTheme = () => {
        const newTheme = pageState.theme === 'light' ? 'dark' : 'light';
        setPageState({ ...pageState, theme: newTheme });
    };

    function setStoredPageState(pageState) {
        localStorage.setItem(`pageState-${tabId}`, JSON.stringify(pageState));
        localStorage.setItem(`path-${tabId}`, loc.pathname);
    }

    async function getStoredPageState() {
        let state = localStorage.getItem(`pageState-${tabId}`);
        if (state !== null && state !== "null" && state !== "undefined" && state !== undefined) {
            setPageState(await JSON.parse(state));
            navigate(localStorage.getItem(`path-${tabId}`));
        } else {
            setPageState({ currentPage: null, currentFolder: null, theme: 'light', viewMode: null, toUpdate: null, folderTree: [] });
        }
    }

    const clearData = () => {
        setPageState({ currentPage: null, currentFolder: null, theme: 'light', viewMode: null, toUpdate: null, folderTree: [] });
        localStorage.removeItem(`pageState-${tabId}`);
        localStorage.removeItem(`path-${tabId}`);
    }

    useEffect(() => {
        document.body.className = pageState.theme;
        const handlePageLoad = () => {
            getStoredPageState();
            localStorage.removeItem(`pageState-${tabId}`);
            localStorage.removeItem(`path-${tabId}`);
        }

        const handlePageUnload = () => {
            setStoredPageState(pageState);
        }

        window.addEventListener("load", handlePageLoad);
        window.addEventListener("beforeunload", handlePageUnload);
        return (() => {
            window.removeEventListener("load", handlePageLoad);
            window.removeEventListener("beforeunload", handlePageUnload);
        });
    }, [pageState]);

    return (
        <PageStateContext.Provider value={{ toggleTheme, pageState, setPageState, clearData, getTabId }}>
            {children}
        </PageStateContext.Provider>
    );
};


export default PageStateProvider;

export const usePageState = () => {
    return useContext(PageStateContext);
};