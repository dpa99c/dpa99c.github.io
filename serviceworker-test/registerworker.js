// Register worker immediately
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceworker.js').then(function (registration) {
        log('Service Worker registered');
    });
}else{
	log("Service Workers are not available");
}
