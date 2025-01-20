const ONE_HOUR = 60 * 60;
interface FetchConditionalCacheOptions extends RequestInit {
  revalidate?: number;
}

async function fetchConditionalCache(
  url: string,
  options?: FetchConditionalCacheOptions
) {
  // Destructure revalidate, spread the rest into fetchOptions
  const { revalidate, ...fetchOptions } = options || {};
  const isCacheEnabled = revalidate !== undefined;
  const nextOptions = isCacheEnabled ? { revalidate: revalidate } : { revalidate: ONE_HOUR };

  const response = await fetch(url, {
    cache: 'no-store',
    ...fetchOptions
  });

  if (response.ok) {
    return fetch(url, {
      ...fetchOptions,
      next: nextOptions
    });
  }

  return response;
}
export default fetchConditionalCache
