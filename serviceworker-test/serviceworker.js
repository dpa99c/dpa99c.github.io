var targetUrl = "https://dpa99c.github.io/test/mailto.html";
var JWT = "1234567890";

function log(msg){
    console.log(msg);
    self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({msg: msg}));
    })
}

self.addEventListener('install', function (event) {
    log('installing');
});

self.addEventListener('activate', function(event) {
    log('activating');
});

self.addEventListener('fetch', function(event) {
    try{
        if(event.request.url.match(targetUrl)){
            log("intercepting fetch(): " + event.request.url);
            let modifiedHeaders = new Headers(event.request.headers);
            modifiedHeaders.set('Authorization', 'Bearer ' + JWT);

            let modifiedRequest = new Request(event.request, {
                headers: modifiedHeaders
            });

            event.respondWith(fetch(modifiedRequest));
        }
    }catch(exception){
        log('ERROR - Fetch event raised exception:', exception);
        throw exception;
    }
});
