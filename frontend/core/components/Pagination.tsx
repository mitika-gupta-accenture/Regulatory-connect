'use client';
import React, { MouseEvent } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (
    event: MouseEvent<HTMLAnchorElement>,
    page: number,
  ) => {
    event.preventDefault();
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li
          key={i}
          className={`govuk-pagination__item ${
            currentPage === i ? 'govuk-pagination__item--current' : ''
          }`}
        >
          <a
            className="govuk-link govuk-pagination__link"
            href="#"
            aria-label={`Page ${i}`}
            aria-current={currentPage === i ? 'page' : undefined}
            onClick={event => handlePageClick(event, i)}
          >
            {i}
          </a>
        </li>,
      );
    }
    return pages;
  };

  return (
    <nav className="govuk-pagination" aria-label="Pagination">
      <div className="govuk-pagination__prev">
        <a
          className={`govuk-link govuk-pagination__link ${
            currentPage === 1 ? 'govuk-pagination__link--disabled' : ''
          }`}
          href="#"
          rel="prev"
          onClick={handlePrevious}
        >
          <svg
            className="govuk-pagination__icon govuk-pagination__icon--prev"
            xmlns="http://www.w3.org/2000/svg"
            height="13"
            width="15"
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 15 13"
          >
            <path d="M6.5938-0.0078125l-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
          </svg>
          <span className="govuk-pagination__link-title">
            Previous<span className="govuk-visually-hidden"> page</span>
          </span>
        </a>
      </div>
      <ul className="govuk-pagination__list">{renderPageNumbers()}</ul>
      <div className="govuk-pagination__next">
        <a
          className={`govuk-link govuk-pagination__link ${
            currentPage === totalPages ? 'govuk-pagination__link--disabled' : ''
          }`}
          href="#"
          rel="next"
          onClick={handleNext}
        >
          <span className="govuk-pagination__link-title">
            Next<span className="govuk-visually-hidden"> page</span>
          </span>
          <svg
            className="govuk-pagination__icon govuk-pagination__icon--next"
            xmlns="http://www.w3.org/2000/svg"
            height="13"
            width="15"
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 15 13"
          >
            <path d="M8.107-0.0078125l-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
          </svg>
        </a>
      </div>
    </nav>
  );
};

export default Pagination;
