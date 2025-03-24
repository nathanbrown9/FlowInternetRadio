self.addEventListener("install", event => {
    console.log(`Intercepting fetch request for: ${event.request.url}`);
    console.log("Service Worker Installed");

    // Cache static assets during the install event
    event.waitUntil(
        caches.open("static-cache").then(cache => {
            return cache.addAll([
                "/",
                "/FLOWHP.html",
                "/style.css",
                "/app.js",
                "/icons/LOGOm.png",    // Add your logo image
                "/icons/LOGOl.png", 
            ]).catch(error => {
                console.error("Cache addAll failed:", error);
            });
        })
    );
});

self.addEventListener("fetch", event => {
    // Return cached assets for requests to assets
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request); // Use cache first, fall back to network
        })
    );
});
