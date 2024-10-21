'use client';
import React, { ChangeEvent } from 'react';

interface Filters {
  search: string;
  status: string[];
  role: string[];
  serviceGroup: string[];
}

interface FilterPanelProps {
  filters: Filters;
  handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  statusOptions?: string[];
  roleOptions?: string[];
  serviceGroupOptions?: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  handleFilterChange,
  statusOptions = ['Enabled', 'Pending', 'Disabled'],
  roleOptions = [
    'Administrator',
    'Regulatory Manager',
    'Regulatory Contributor',
  ],
  serviceGroupOptions = [
    'Service Group A',
    'Service Group B',
    'Service Group C',
    'Service Group D',
  ],
}) => {
  return (
    <div>
      <h2 className="govuk-heading-m govuk-table__header">Filters</h2>

      {/* Search Filter */}
      <div className="govuk-form-group govuk-section-break--visible">
        <label className="govuk-label" htmlFor="search">
          Email/user ID
        </label>
        <input
          className="govuk-input govuk-body"
          id="search"
          name="search"
          type="text"
          value={filters.search}
          onChange={handleFilterChange}
        />
      </div>

      {/* Status Filter */}
      <details className="govuk-details" data-module="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">Status</span>
        </summary>
        <div>
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend govuk-visually-hidden">
              Status
            </legend>
            <div className="govuk-checkboxes govuk-checkboxes--small">
              {statusOptions.map(status => (
                <div className="govuk-checkboxes__item" key={status}>
                  <input
                    className="govuk-checkboxes__input"
                    id={`status-${status}`}
                    name="status"
                    type="checkbox"
                    value={status}
                    checked={filters.status.includes(status)}
                    onChange={handleFilterChange}
                  />
                  <label
                    className="govuk-label govuk-checkboxes__label"
                    htmlFor={`status-${status}`}
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </details>

      <div className="govuk-section-break--visible"></div>
      <br />

      {/* Role Filter */}
      <details className="govuk-details" data-module="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">Role</span>
        </summary>
        <div>
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend govuk-visually-hidden">
              Role
            </legend>
            <div className="govuk-checkboxes govuk-checkboxes--small">
              {roleOptions.map(role => (
                <div className="govuk-checkboxes__item" key={role}>
                  <input
                    className="govuk-checkboxes__input"
                    id={`role-${role}`}
                    name="role"
                    type="checkbox"
                    value={role}
                    checked={filters.role.includes(role)}
                    onChange={handleFilterChange}
                  />
                  <label
                    className="govuk-label govuk-checkboxes__label"
                    htmlFor={`role-${role}`}
                  >
                    {role}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </details>

      <div className="govuk-section-break--visible"></div>
      <br />

      {/* Service Group Filter */}
      <details className="govuk-details" data-module="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">Service Group</span>
        </summary>
        <div>
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend govuk-visually-hidden">
              Service Group
            </legend>
            <div className="govuk-checkboxes govuk-checkboxes--small">
              {serviceGroupOptions.map(serviceGroup => (
                <div className="govuk-checkboxes__item" key={serviceGroup}>
                  <input
                    className="govuk-checkboxes__input"
                    id={`serviceGroup-${serviceGroup}`}
                    name="serviceGroup"
                    type="checkbox"
                    value={serviceGroup}
                    checked={filters.serviceGroup.includes(serviceGroup)}
                    onChange={handleFilterChange}
                  />
                  <label
                    className="govuk-label govuk-checkboxes__label"
                    htmlFor={`serviceGroup-${serviceGroup}`}
                  >
                    {serviceGroup}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </details>

      <div className="govuk-section-break--visible"></div>
    </div>
  );
};

export default FilterPanel;
