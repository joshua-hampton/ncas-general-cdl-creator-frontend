import React from 'react';
import Sidebar from '../Sidebar/Sidebar.jsx';
import TemporaryDrawer from '../Drawer/Drawer.jsx' 
import { CustomizedSwitches } from '../DarkMode/DarkMode.jsx';

function HeaderWithDarkMode() {
  return (
    <div className="flex justify-between items-center h-20 w-[90%] fixed bg-white dark:bg-[#1e1e2e]">
        <TemporaryDrawer />
        <CustomizedSwitches />
    </div>
  );
}

function Header() {
  return (
    <div className="flex justify-between items-center h-20 w-[90%] fixed bg-white dark:bg-[#1e1e2e]">
        <TemporaryDrawer />
    </div>
  );
}

export default Header;
