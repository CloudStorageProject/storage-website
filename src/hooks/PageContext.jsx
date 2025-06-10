import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PageStateContext = createContext();

const PageStateProvider = ({ children }) => {
    const [pageState, setPageState] = useState({ currentPage: null, currentFolder: null, theme: 'light', viewMode: null, toUpdate: null, folderTree: [] });
    const navigate = useNavigate();
    const loc = useLocation();
    // Callback to make compiler stfu
    const getStoredPageStateCallback = useCallback(getStoredPageState, [navigate]);
    const setStoredPageStateCallback = useCallback(setStoredPageState, [loc.pathname]);

    const toggleTheme = () => {
        const newTheme = pageState.theme === 'light' ? 'dark' : 'light';
        setPageState({ ...pageState, theme: newTheme });
    };

    function setStoredPageState(pageState) {
        localStorage.setItem(`pageState`, JSON.stringify(pageState));
        localStorage.setItem(`path`, loc.pathname);
    }

    async function getStoredPageState() {
        let state = localStorage.getItem(`pageState`);
        if (state !== null && state !== "null" && state !== "undefined" && state !== undefined) {
            setPageState(await JSON.parse(state));
            navigate(localStorage.getItem(`path`));

        } else {
            setPageState({ currentPage: null, currentFolder: null, theme: 'light', viewMode: null, toUpdate: null, folderTree: [] });
        }
    }

    const clearData = () => {
        setPageState({ currentPage: null, currentFolder: null, theme: 'light', viewMode: null, toUpdate: null, folderTree: [] });

        localStorage.removeItem(`pageState`);
        localStorage.removeItem(`path`);
    }

    useEffect(() => {
        document.body.className = pageState.theme;
        const handlePageLoad = () => {
            getStoredPageStateCallback();
            localStorage.removeItem(`pageState`);
            localStorage.removeItem(`path`);
        }

        const handlePageUnload = () => {
            setStoredPageStateCallback(pageState);
        }

        window.addEventListener("load", handlePageLoad);
        window.addEventListener("beforeunload", handlePageUnload);
        return (() => {
            window.removeEventListener("load", handlePageLoad);
            window.removeEventListener("beforeunload", handlePageUnload);
        });
    }, [pageState, getStoredPageStateCallback, setStoredPageStateCallback]);

    return (
        <PageStateContext.Provider value={{ toggleTheme, pageState, setPageState, clearData }}>
            {children}
        </PageStateContext.Provider>
    );
};


export default PageStateProvider;

export const usePageState = () => {
    return useContext(PageStateContext);
};