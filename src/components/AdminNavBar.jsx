import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';

const NavItem = ({ label, dropdownKey, openDropdown, toggleDropdown, links }) => (
  <li className="relative">
    <button
      onClick={() => toggleDropdown(dropdownKey)}
      className="flex justify-between items-center text-lg py-2 px-4 w-full text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
      aria-expanded={openDropdown === dropdownKey}
      aria-controls={`${dropdownKey}-menu`}
    >
      <span>{label}</span>
      <FiChevronDown
        className={`transition-transform duration-300 ${
          openDropdown === dropdownKey ? 'rotate-180' : ''
        }`}
      />
    </button>
    {openDropdown === dropdownKey && (
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

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <nav className="bg-white shadow h-screen w-64 p-6">
      <ul className="space-y-4">
        <NavItem
          label="Exam"
          dropdownKey="exam"
          openDropdown={openDropdown}
          toggleDropdown={toggleDropdown}
          links={[
            { to: '/admin/exam-creation', label: 'Exam Creation' },
          ]}
        />
        <NavItem
          label="Session"
          dropdownKey="session"
          openDropdown={openDropdown}
          toggleDropdown={toggleDropdown}
          links={[
            { to: '/admin/session-creation', label: 'Session Creation' },
            { to: '/admin/session-management', label: 'Session Management' },
          ]}
        />
        <NavItem
          label="User"
          dropdownKey="user"
          openDropdown={openDropdown}
          toggleDropdown={toggleDropdown}
          links={[
            { to: '/admin/user-creation', label: 'User Creation' },
            { to: '/admin/view-user', label: 'View User' },
          ]}
        />
      </ul>
    </nav>
  );
};

export default AdminNavBar;
