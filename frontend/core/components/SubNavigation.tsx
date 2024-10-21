'use client';
import React from 'react';

interface NavLink {
  label: string;
  href: string;
}

interface SubNavigationProps {
  links: NavLink[];
  activeItem: string;
}

const SubNavigation: React.FC<SubNavigationProps> = ({ links, activeItem }) => {
  return (
    <nav className="moj-sub-navigation" aria-label="Sub navigation">
      <ul className="moj-sub-navigation__list">
        {links.map((link, index) => (
          <li className="moj-sub-navigation__item" key={index}>
            <a
              className={'moj-sub-navigation__link'}
              href={link.href}
              aria-current={activeItem === link.href && 'page'}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SubNavigation;
