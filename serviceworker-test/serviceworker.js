(function(){
    var targetUrl = "test/mailto.html";
    var JWT = "1234567890";

    function isRunningAsServiceWorker(){
        return typeof window === 'undefined';
    }

    function log(msg){
        console.log(msg);
        if(isRunningAsServiceWorker()){
            self.clients.matchAll().then(clients => {
                clients.forEach(client => client.postMessage({msg: msg}));
            })
        }else{
            document.dispatchEvent(new CustomEvent("service-worker-message", {detail: msg}));
        }
    }

    function modifyRequest(request){
        log("intercepting fetch(): " + request.url);
        let modifiedHeaders = new Headers(request.headers);
        modifiedHeaders.set('Authorization', 'Bearer ' + JWT);

        return new Request(request, {
            headers: modifiedHeaders
        });
    }

    async function modifyResponse(response){
        const bodyText = await response.text();
        const modifiedBodyText = "modified response: "+bodyText;
        return new Response(modifiedBodyText, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });
    }

    if(isRunningAsServiceWorker()){
        log("Running as service worker");

        self.addEventListener('install', event => event.waitUntil(installServiceWorker()));
        async function installServiceWorker() {
            log("installing");
            return self.skipWaiting();
        }

        self.addEventListener('activate', event => event.waitUntil(activateServiceWorker()));
        async function activateServiceWorker() {
            log("activating");
            return self.clients.claim();
        }

        // Intercept fetch requests
        self.addEventListener("fetch", event => {
            if(event.request.url.match(targetUrl)){
                event.respondWith(fetchAndModify(event.request));
            }
        });
        async function fetchAndModify(request) {
            try{
                // intercept request here
                request = modifyRequest(request);

                let response = await fetch(request);

                // intercept response here
                response = modifyResponse(response);

                return response;
            }catch(exception){
                log('ERROR - Fetch event raised exception:', exception);
                throw exception;
            }
        }
    }else{
        log("Running as script");

        // Monkey patch window.fetch
        const fetch = window.fetch;
        window.fetch = (...args) => (async(args) => {
            let request = args[0];
            if (typeof request === "string"){
                request = new Request(request);
            }

            // intercept request here
            if(request.url.match(targetUrl)){
                args[0] = modifyRequest(request);
            }

            let response = await fetch(...args);

             // intercept response here
            if(request.url.match(targetUrl)){
                response = modifyResponse(response);
            }
            return response;
        })(args);
    }
})();
