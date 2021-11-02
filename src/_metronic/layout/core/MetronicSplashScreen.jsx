import React, { createContext, useContext, useState, useEffect, } from 'react';
const MetronicSplashScreenContext = createContext(undefined);
const MetronicSplashScreenProvider = ({ children }) => {
    const [count, setCount] = useState(0);
    let visible = count > 0;
    useEffect(() => {
        const splashScreen = document.getElementById('splash-screen');
        // Show SplashScreen
        if (splashScreen && visible) {
            splashScreen.classList.remove('hidden');
            return () => {
                splashScreen.classList.add('hidden');
            };
        }
        // Hide SplashScreen
        let timeout;
        if (splashScreen && !visible) {
            timeout = window.setTimeout(() => {
                splashScreen.classList.add('hidden');
            }, 3000);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [visible]);
    return (<MetronicSplashScreenContext.Provider value={setCount}>
      {children}
    </MetronicSplashScreenContext.Provider>);
};
const LayoutSplashScreen = ({ visible = true }) => {
    // Everything are ready - remove splashscreen
    const setCount = useContext(MetronicSplashScreenContext);
    useEffect(() => {
        if (!visible) {
            return;
        }
        if (setCount) {
            setCount((prev) => {
                return prev + 1;
            });
        }
        return () => {
            if (setCount) {
                setCount((prev) => {
                    return prev - 1;
                });
            }
        };
    }, [setCount, visible]);
    return null;
};
export { MetronicSplashScreenProvider, LayoutSplashScreen };
