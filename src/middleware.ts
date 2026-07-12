import { defineMiddleware } from 'astro:middleware';

const HTML_CACHE_CONTROL = 'public, max-age=0, must-revalidate';
const ASSET_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const ERROR_CACHE_CONTROL = 'no-store';

function withCacheControl(response: Response, cacheControl: string): Response {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', cacheControl);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  const response = await next();
  const pathname = url.pathname;

  if (pathname.startsWith('/_astro/')) {
    const isCacheableAssetResponse = response.ok || response.status === 304;
    return withCacheControl(
      response,
      isCacheableAssetResponse ? ASSET_CACHE_CONTROL : ERROR_CACHE_CONTROL,
    );
  }

  const contentType = response.headers.get('Content-Type') || '';
  const accept = request.headers.get('Accept') || '';
  const isDocumentResponse = contentType.includes('text/html') || accept.includes('text/html');

  if (isDocumentResponse) {
    return withCacheControl(response, HTML_CACHE_CONTROL);
  }

  return response;
});
