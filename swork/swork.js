this.addEventListener('install', function(e) {
	console.log("Installing...");
	// use promises here, not async
	// e.skipWaiting();  // activate straight away
	e.waitUntil(caches.open('v1').then(cache => {
		return cache.addAll([
			'.',
			'index.html',
			'test.jpg',
			'test2.png',
			'test3.png'
		]);
	}).then(e => {
		// make service worker activate *before* the above cached files have finished loading
		console.log("Cache loaded.");
		return this.skipWaiting();
	}));
});

this.addEventListener('activate', function(e) {
	console.log("Service Worker Activated", e);
	// initialize the service worker now, without waiting for page refresh
	return this.clients.claim();
});

this.addEventListener('fetch', function(e) {
	e.respondWith(caches.match(e.request).then(response => {
		// rewrite images
		if ((/test/).test(response.url)) {
			console.log("Cache rewrite on:", response.url);
			return caches.match('test3.png');
		}
		// cache hit
		if (response !== undefined) {
			console.log("Cache hit:", e.request);
			return response;
		}
		// cache miss
		console.log("Cache miss:", e.request);
		return caches.match('test2.png');
	}));
});