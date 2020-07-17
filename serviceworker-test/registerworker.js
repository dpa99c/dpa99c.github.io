// Register worker immediately
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceworker.js').then(function (registration) {
        log('Service Worker registered');
        window.serviceWorkerRegistered = true;
        document.dispatchEvent(new Event("service-worker-registered"));
    });
}else{
	log("Service Workers are not available");
    window.serviceWorkersNotSupported = true;
}
