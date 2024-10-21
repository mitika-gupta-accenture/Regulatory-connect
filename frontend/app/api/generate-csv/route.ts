import * as session from 'core/models/redis';

export async function GET() {
  try {
    const data = await session.get('MhraRIId');
    const prefix = (await session.get('filePrefix')) as string;

    if (Array.isArray(data)) {
      const csvRows = data.join('\n');
      return new Response(csvRows, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${prefix}.csv"`,
        },
      });
    } else {
      throw new Error('Data is not an array of strings');
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
