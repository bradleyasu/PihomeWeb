/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// CRA 5 Workbox service worker.
// The build tool (workbox-build via react-scripts) injects the precache
// manifest into self.__WB_MANIFEST at build time.

import { clientsClaim } from 'workbox-core';
import {
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache all build assets (injected by workbox-build at build time).
precacheAndRoute(self.__WB_MANIFEST);

// Single-page app shell — serve index.html for all navigation requests.
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }: { request: Request; url: URL }) => {
    if (request.mode !== 'navigate') return false;
    if (url.pathname.startsWith('/_')) return false;
    if (url.pathname.match(fileExtensionRegexp)) return false;
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Cache Google Fonts with a stale-while-revalidate strategy, 1-year max age.
registerRoute(
  ({ url }: { url: URL }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts',
    plugins: [new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 })],
  })
);

// Cache CDN assets (weather icons, app icons).
registerRoute(
  ({ url }: { url: URL }) => url.origin === 'https://cdn.pihome.io',
  new StaleWhileRevalidate({
    cacheName: 'pihome-cdn',
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 })],
  })
);

// Skip waiting so updates are applied immediately when user reopens the app.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
