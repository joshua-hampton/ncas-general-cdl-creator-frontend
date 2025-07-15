import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <Menu>
      <a className="menu-item" href="/">
        Home
      </a>
      <a className="menu-item" href="/about">
        About
      </a>
    </Menu>
  );
};

export default Sidebar;

