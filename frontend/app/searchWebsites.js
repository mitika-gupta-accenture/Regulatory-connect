'use server';

import { queryConnection } from '../core/db/connection';
import Formatters from 'core/util/Formatters';

export async function searchWebsites(question, queryData) {
  const userInput = Formatters.trimURL(queryData.get('Search'));
  const query = 'SELECT website FROM suspicious_websites WHERE website = $1';
  const values = [userInput];

  try {
    const foundWebsite = await queryConnection(query, values);
    return !!foundWebsite.rowCount;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
