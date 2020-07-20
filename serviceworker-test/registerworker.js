var serviceWorkerPath = 'serviceworker.js';

function areServiceWorkersAvailable(){
    return 'serviceWorker' in navigator;
}

function log(msg){
    if(document.body) document.body.innerHTML += '<p>'+msg+'</p>';
    console.log(msg);
}

if(areServiceWorkersAvailable()) {
    // Register as service worker
    log('Service Workers available -  registering...');
    navigator.serviceWorker.register(serviceWorkerPath).then(function (registration) {
        log('Service Worker registered');
        window.serviceWorkerRegistered = true;
        document.dispatchEvent(new Event("service-worker-registered"));
    });
}else{
    // Load as script
	document.addEventListener('DOMContentLoaded', (event) => {
        log("Service Workers are not available: falling back to load as script");
        var script = document.createElement('script');
        script.onload = function () {
            log("Service worker loaded as script");
        };
        script.src = serviceWorkerPath;
        document.head.appendChild(script);
    })
}
