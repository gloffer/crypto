import React, { useRef, useEffect } from 'react';
import { useLayout } from '../core';
const BG_COLORS = ['bg-white', 'bg-info'];
export function Sidebar() {
    const { classes } = useLayout();
    const sidebarCSSClass = classes.sidebar;
    const sideBarRef = useRef(null);
    useEffect(() => {
        if (!sidebarCSSClass) {
            return;
        }
        BG_COLORS.forEach((cssClass) => {
            sideBarRef.current?.classList.remove(cssClass);
        });
        sidebarCSSClass.forEach((cssClass) => {
            sideBarRef.current?.classList.add(cssClass);
        });
    }, [sidebarCSSClass]);
    return <>Sidebar</>;
}
