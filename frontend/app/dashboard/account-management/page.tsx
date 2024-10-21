'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import Pagination from '../../../core/components/Pagination';
import Button from 'core/components/Button';
import { GridRow, GridCol } from '@mhra/mhra-design-components';
import '../../../styles/app.scss';
import * as session from '../../../core/models/redis';
import SortableTable from 'core/components/SortableTable';
import FilterPanel from 'core/components/FilterPanel';
import SubNavigation from 'core/components/SubNavigation';
import FilterTable from 'core/components/FilterTable';
import { userDetailsIsFound } from './actions';
import { Organisation, OrgUser } from 'core/models/apiModel';
import _ from 'lodash';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Record {
  id: string;
  email: string;
  serviceGroup: string;
  role: string;
  status: string;
}

interface SortConfig {
  key: keyof Record;
  direction: 'ascending' | 'descending';
}

interface Filters {
  search: string;
  status: string[];
  role: string[];
  serviceGroup: string[];
}

export default function Page() {
  const [organisationName, setOrganisationName] = useState('');
  const [userRecords, setUserRecords] = useState<Record[]>([]);
  const [sortConfig] = useState<SortConfig>({
    key: 'id',
    direction: 'ascending',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: [],
    role: [],
    serviceGroup: [],
  });
  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;
  const path = usePathname();

  useEffect(() => {
    const fetchOrganisationDetails = async () => {
      try {
        setLoading(true);
        const organisationDetails = (await session.get(
          'selectedOrganisation',
        )) as Organisation;
        setOrganisationName(organisationDetails.name);

        const response = (await userDetailsIsFound(
          organisationDetails.identifier,
        )) as OrgUser[];

        // const serviceGroups = [
        //   'Service Group A',
        //   'Service Group B',
        //   'Service Group C',
        //   'Service Group D',
        // ];

        if (response[0]) {
          const mappedRecords = _.uniqBy(
            response.map((orgUser: OrgUser) => ({
              id: orgUser.personIdentifier || 'N/A',
              email: orgUser.primaryContactEmailAddress || 'N/A',
              serviceGroup: 'Service Group A',
              role:
                orgUser.webUserAccountRoleName !== 'Admin' &&
                orgUser.webUserAccountRoleName !== 'Manager'
                  ? 'Contributor'
                  : orgUser.webUserAccountRoleName,
              status: orgUser.webUserAccountStatusName || 'N/A',
            })),
            'id',
          );
          setUserRecords(mappedRecords);
        } else {
          console.error('No users found for the organisation');
        }
      } catch (error) {
        console.error('Error fetching organisation details:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchOrganisationDetails();
  }, []);

  const sortedRecords = [...userRecords].sort((a: Record, b: Record) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name === 'search') {
      setFilters(prevFilters => ({ ...prevFilters, search: value }));
    } else {
      const filterArray = filters[name as keyof Filters] as string[];
      if (checked) {
        setFilters(prevFilters => ({
          ...prevFilters,
          [name]: [...filterArray, value],
        }));
      } else {
        setFilters(prevFilters => ({
          ...prevFilters,
          [name]: filterArray.filter(item => item !== value),
        }));
      }
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      status: [],
      role: [],
      serviceGroup: [],
    });
  };

  const filterRecords = (records: Record[]) => {
    return records.filter(record => {
      const matchesSearch = record.email
        .toUpperCase()
        .includes(filters.search.toUpperCase());
      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(record.status);
      const matchesRole =
        filters.role.length === 0 || filters.role.includes(record.role);
      const matchesServiceGroup =
        filters.serviceGroup.length === 0 ||
        filters.serviceGroup.includes(record.serviceGroup);
      return (
        matchesSearch && matchesStatus && matchesRole && matchesServiceGroup
      );
    });
  };

  const filteredRecords = filterRecords(sortedRecords);

  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );

  const links = [
    { label: 'Manage users', href: '/dashboard/account-management' },
    {
      label: 'Organisation details',
      href: '/dashboard/account-management/organisation-details',
    },
    { label: 'Apply for SME status', href: '#' },
  ];

  const removeFilter = (filterName: keyof Filters, filterValue: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: (prevFilters[filterName] as string[]).filter(
        (value: string) => value !== filterValue,
      ),
    }));
  };

  return (
    <GridRow>
      <div className="govuk-summary-list">
        <br />
        <SubNavigation links={links} activeItem={path} />
        <GridCol className="full">
          <h1 className="govuk-heading-xl govuk-!-margin-bottom-0">
            Manage users
            <span className="govuk-caption-m">{organisationName}</span>
          </h1>
        </GridCol>
        <GridCol className="full govuk-!-margin-top-"></GridCol>

        {(filters.status.length > 0 ||
          filters.role.length > 0 ||
          filters.serviceGroup.length > 0) && (
          <GridCol className="full govuk-!-margin-top-3">
            <a href="#" className="govuk-link" onClick={clearAllFilters}>
              Remove All Filters
            </a>
          </GridCol>
        )}

        <GridCol className="full govuk-!-margin-top-3">
          <FilterTable
            currentFilter={filters.status}
            removeFilter={removeFilter}
            filterLabel={'status'}
          />
          <FilterTable
            currentFilter={filters.role}
            removeFilter={removeFilter}
            filterLabel={'role'}
          />
          <FilterTable
            currentFilter={filters.serviceGroup}
            removeFilter={(x: keyof Filters, y: string) =>
              removeFilter('serviceGroup', y)
            }
            filterLabel={'service group'}
          />
        </GridCol>

        <GridCol className="full govuk-!-margin-top-3">
          <button
            type="button"
            className="govuk-button--custom-blue"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide filters to show full table' : 'Show filters'}
          </button>
        </GridCol>

        {showFilters && (
          <GridCol className="one-third">
            <FilterPanel
              filters={filters}
              handleFilterChange={handleFilterChange}
              statusOptions={['Enabled', 'Pending', 'Disabled']}
              roleOptions={['Admin', 'Manager', 'Contributor']}
              serviceGroupOptions={[
                'Service Group A',
                'Service Group B',
                'Service Group C',
                'Service Group D',
              ]}
            />
          </GridCol>
        )}

        <GridCol className={showFilters ? 'two-thirds' : 'full'}>
          <div className="govuk-heading-m govuk-table__header">
            {filteredRecords.length} records
          </div>

          {loading ? (
            <div className="govuk-body">Loading...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="results-error">
              <h2 className="govuk-heading-m">No results</h2>
              <p>Use the filters on the left to refine your search</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <SortableTable
                records={currentRecords}
                className={
                  showFilters ? 'govuk-table--custom-width' : 'govuk-table'
                }
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'email', label: 'Email' },
                  { key: 'serviceGroup', label: 'Service Group' },
                  { key: 'role', label: 'Role' },
                  { key: 'status', label: 'Status' },
                ]}
              />
            </div>
          )}

          <div className="govuk-section-break govuk-section-break--visible">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredRecords.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>

          <div className="govuk-!-padding-top-8">
            <Link
              href={'/dashboard/account-management/add-user'}
              onClick={async () => {
                await session.clearAnswer('newUserDetails');
              }}
              id={'add-user'}
              type="link"
            >
              <Button
                text={'Add a new user'}
                className={'govuk-button govuk-button--secondary'}
              />
            </Link>
          </div>

          <details
            className="govuk-details govuk-!-margin-top-4"
            data-module="govuk-details"
          >
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">
                What does each status mean?
              </span>
            </summary>
            <div className="govuk-details__text">
              <p>How we use colour on statuses:</p>
              <ul className="govuk-list govuk-list--bullet">
                <li>
                  <strong>Grey - </strong> no action required
                </li>
                <li>
                  <strong>Yellow - </strong> user must take action
                </li>
                <li>
                  <strong>Green - </strong> user with positive outcome
                </li>
                <li>
                  <strong>Red - </strong> user with negative outcome
                </li>
              </ul>
              <ul className="govuk-list govuk-list--bullet">
                <li>
                  <strong>Enabled - </strong> This user is registered on
                  RegulatoryConnect.
                </li>
                <li>
                  <strong>Pending - </strong> This user has been invited by the
                  organisation admin to register for a RegulatoryConnect
                  account.
                </li>
                <li>
                  <strong>Disabled - </strong> This user's permissions have been
                  temporarily removed.
                </li>
              </ul>
            </div>
          </details>

          <p>
            If you have any questions relating to this page,{' '}
            <a
              href="/contact-mhra"
              className="govuk-link"
              rel="noreferrer noopener"
              target="_blank"
            >
              contact MHRA
            </a>
          </p>
        </GridCol>

        <GridCol className="full">
          <div>
            <p className="govuk-!-padding-top-6">
              <a
                href="/report-a-problem"
                className="govuk-link"
                rel="noreferrer noopener"
                target="_blank"
              >
                Report a problem with this page (opens in new tab)
              </a>
            </p>
          </div>
        </GridCol>
      </div>
    </GridRow>
  );
}
