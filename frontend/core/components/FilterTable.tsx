'use client';

import React from 'react';

interface FilterTableProps {
  currentFilter: string[];
  filterLabel: string;
  removeFilter: any;
}

export default function FilterTable({
  currentFilter,
  filterLabel,
  removeFilter,
}: FilterTableProps) {
  if (!!currentFilter[0]) {
    return (
      <>
        <div className="filter-container">
          <span className="filter-element filter-label">For {filterLabel}</span>

          {currentFilter.map((filter, index) => (
            <span key={filter} className="filter-element">
              <button
                type="button"
                className="filter-pill-button"
                onClick={() => removeFilter(filterLabel, filter)}
              >
                <span aria-hidden="true">&times;</span> {filter}
              </button>
              <span className="filter-element">
                {currentFilter.length - 1 !== index && 'or'}
              </span>
            </span>
          ))}
        </div>
      </>
    );
  } else {
    return null;
  }
}
