export async function GET() {
  return new Response(
    JSON.stringify({ error: 'DownloadReports temporarily disabled for related works.' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
  );
}
