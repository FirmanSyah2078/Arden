import {defaultCache} from '@serwist/next/worker'
import type {PrecacheEntry, SerwistGlobalConfig,} from 'serwist'
import {NetworkFirst, Serwist} from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry|string)[]|undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const navigationCache = {
  matcher: ({request}: {request: Request}) =>
      request.method === 'GET' && request.mode === 'navigate',
  handler: new NetworkFirst({
    cacheName: 'arden-navigation',
    networkTimeoutSeconds: 3,
  }),
}

const rscCache = {
  matcher: ({request, url}: {request: Request; url: URL}) =>
      request.method === 'GET' &&
      (request.headers.get('RSC') === '1' || url.searchParams.has('_rsc')),
  handler: new NetworkFirst({
    cacheName: 'arden-rsc',
    networkTimeoutSeconds: 3,
  }),
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    navigationCache,
    rscCache,
    ...defaultCache,
  ],
});

serwist.addEventListeners();