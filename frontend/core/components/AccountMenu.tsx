'use client';
import React from 'react';

interface MenuItem {
  label: string;
  link: string;
}

interface AccountMenuProps {
  homeLink: string;
  menuItems: MenuItem[];
  activeItem?: string;
}

const AccountMenu: React.FC<AccountMenuProps> = ({
  homeLink,
  menuItems,
  activeItem,
}) => {
  return (
    <div className="govuk-width-container">
      <nav
        id="secondary-nav"
        className="hmrc-account-menu"
        aria-label="Account"
        data-module="hmrc-account-menu"
      >
        <a
          href={homeLink}
          className={`hmrc-account-menu__link hmrc-account-menu__link--home 
              ${activeItem === '/dashboard' ? 'hmrc-account-menu__link--active' : ''}`}
        >
          <span className="hmrc-account-icon hmrc-account-icon--home">
            Account home
          </span>
        </a>

        <a
          href="#"
          className="hmrc-account-menu__link hmrc-account-menu__link--menu js-hidden js-visible"
          tabIndex={-1}
          aria-hidden="true"
          aria-expanded="false"
        >
          Account menu
        </a>

        <ul className="hmrc-account-menu__main js-hidden">
          {/* Optional Back Link */}
          <li
            className="hmrc-account-menu__link--back hidden"
            aria-hidden="true"
          >
            <a href="#" tabIndex={-1} className="hmrc-account-menu__link">
              Back
            </a>
          </li>

          {/* Dynamically Render Menu Items */}
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.link}
                className={`hmrc-account-menu__link ${activeItem?.includes(item.link) ? 'hmrc-account-menu__link--active' : ''}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AccountMenu;
