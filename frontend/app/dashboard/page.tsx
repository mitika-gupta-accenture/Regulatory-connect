'use client';
import React, { useEffect, useState } from 'react';
import { GridRow, GridCol } from '@mhra/mhra-design-components';
import * as session from '../../core/models/redis';
import DashboardTile from 'core/components/DashboardTiles';
import TilesJson from './dashboardTileContent.json';
import { Organisation } from 'core/models/apiModel';
import { usePermissions } from 'core/services/auth/usePermissions';

export default function Page() {
  const [organisationName, setOrganisationName] = useState<string>('');
  const { hasPermission } = usePermissions();
  const [accountManagementPerms, setAccountManagementPerms] = useState(false);

  useEffect(() => {
    const fetchOrganisationDetails = async () => {
      try {
        const organisationDetails = (await session.get(
          'selectedOrganisation',
        )) as Organisation;

        if (organisationDetails) {
          setOrganisationName(organisationDetails.name);
        } else {
          console.error('No organisation name found');
        }
        setAccountManagementPerms(
          hasPermission('Account Management', 'Read/View'),
        );
      } catch (error) {
        console.error('Error fetching organisation details:', error);
      }
    };

    void fetchOrganisationDetails();
  }, [hasPermission, accountManagementPerms]);

  const tiles = TilesJson;

  return (
    <GridRow>
      <br />
      <GridRow>
        <GridCol className="full">
          <h1 className="govuk-heading-xl">{organisationName}</h1>
        </GridCol>
      </GridRow>

      <GridRow>
        <DashboardTile
          title="Latest RegulatoryConnect features"
          description="Here, you can find all the newest features and updates to the RegulatoryConnect service."
          linkText="Read about the latest features"
          linkHref="/new-features"
          columnClassName="two-thirds"
        />
      </GridRow>

      {tiles.map((tile, index) => {
        if (tile.title === 'Account management') {
          {
            if (accountManagementPerms) {
              return (
                <DashboardTile
                  key={index}
                  title={tile.title}
                  description={tile.description}
                  linkText={tile.linkText}
                  linkHref={tile.linkHref}
                  columnClassName={tile.columnClassName}
                />
              );
            } else {
              null;
            }
          }
        } else {
          return (
            <DashboardTile
              key={index}
              title={tile.title}
              description={tile.description}
              linkText={tile.linkText}
              linkHref={tile.linkHref}
              columnClassName={tile.columnClassName}
            />
          );
        }
      })}

      <GridCol className="full">
        <br />
        <div>
          <p>
            <a
              href="/contactmhra"
              className="govuk-link"
              rel="noreferrer noopener"
              target="_blank"
            >
              Report a problem with this page (opens in new tab)
            </a>
          </p>
        </div>
      </GridCol>
    </GridRow>
  );
}
