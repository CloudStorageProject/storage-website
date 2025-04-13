import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PageStateContext = createContext();

const PageStateProvider = ({ children }) => {
    const [pageState, setPageState] = useState({ currentPage: null, currentFolder: null, theme: 'light', viewMode: null, toUpdate: null, folderTree: [] });
    const loc = useLocation();
    const navigate = useNavigate();

    const toggleTheme = () => {
        const newTheme = pageState.theme === 'light' ? 'dark' : 'light';
        setPageState({ ...pageState, theme: newTheme });
    };

    async function setStoredPageState(pageState) {
        localStorage.setItem("pageState", await JSON.stringify(pageState));
        localStorage.setItem("path", loc.pathname);
    }

    async function getStoredPageState() {
        let state = localStorage.getItem("pageState");
        if (state !== null && state !== "null" && state !== "undefined" && state !== undefined) {
            setPageState(await JSON.parse(state));
            navigate(localStorage.getItem("path"));
        } else {
            setPageState({ currentPage: null, currentFolder: null, theme: 'light', viewMode: null, toUpdate: null, folderTree: [] });
        }
    }

    useEffect(() => {
        document.body.className = pageState.theme;
        const handlePageLoad = () => {
            getStoredPageState();
            localStorage.removeItem("pageState");
            localStorage.removeItem("path");
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
        <PageStateContext.Provider value={{ toggleTheme, pageState, setPageState, }}>
            {children}
        </PageStateContext.Provider>
    );
};


export default PageStateProvider;

export const usePageState = () => {
    return useContext(PageStateContext);
};