// AdminNavBar.jsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiChevronDown, FiMenu, FiBook, FiUser, FiLayers } from 'react-icons/fi';

const navItems = [
  {
    label: 'Exam',
    icon: <FiBook />,
    dropdownKey: 'exam',
    links: [{ to: '/admin/exam-creation', label: 'Exam Creation' }, { to: '/admin/questions/generate', label: 'Questions Generate' }],
  },
  {
    label: 'Session',
    icon: <FiLayers />,
    dropdownKey: 'session',
    links: [
      { to: '/admin/session-creation', label: 'Session Creation' },
      { to: '/admin/session-management', label: 'Session Management' },
    ],
  },
  {
    label: 'User',
    icon: <FiUser />,
    dropdownKey: 'user',
    links: [
      { to: '/admin/user-creation', label: 'User Creation' },
      { to: '/admin/view-user', label: 'View User' },
    ],
  },
];

const NavItem = ({
  label,
  icon,
  dropdownKey,
  openDropdown,
  toggleDropdown,
  links,
  isCollapsed,
}) => (
  <li className="relative">
    <button
      onClick={() => toggleDropdown(dropdownKey)}
      className={`flex items-center text-lg py-2 px-2 w-full text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200`}
      aria-expanded={openDropdown === dropdownKey}
      aria-controls={`${dropdownKey}-menu`}
    >
      <span className="mr-3 text-xl">{icon}</span>
      <span className={`flex-1 ${isCollapsed ? 'hidden' : ''}`}>{label}</span>
      {!isCollapsed && links.length > 0 && (
        <FiChevronDown
          className={`transition-transform duration-300 ${
            openDropdown === dropdownKey ? 'rotate-180' : ''
          }`}
        />
      )}
    </button>
    {!isCollapsed && openDropdown === dropdownKey && links.length > 0 && (
      <ul
        id={`${dropdownKey}-menu`}
        className="mt-1 bg-white shadow rounded py-2"
        role="menu"
        aria-label={`${label} submenu`}
      >
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    )}
  </li>
);

const AdminNavBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleMouseEnter = () => {
    setIsCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsCollapsed(true);
  };

  return (
    <nav
      className="bg-white shadow h-screen fixed top-0 left-0 z-20 transition-all duration-300 ease-in-out"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width: isCollapsed ? '60px' : '220px' }}
    >
      <div className="p-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.dropdownKey}
              label={item.label}
              icon={item.icon}
              dropdownKey={item.dropdownKey}
              openDropdown={openDropdown}
              toggleDropdown={toggleDropdown}
              links={item.links}
              isCollapsed={isCollapsed}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavBar;
