var targetUrl = "https://dpa99c.github.io/test/mailto.html";

navigator.serviceWorker.addEventListener('message', event => {
	log("service worker: "+event.data.msg);
});

function onReady(){
	if(window.serviceWorkersNotSupported || window.serviceWorkerRegistered){
		doFetch();
	}else{
		document.addEventListener("service-worker-registered", doFetch, false);
	}
}

function doFetch(){
	log("Fetching target URL");
	fetch(targetUrl)
		.then(function(){
			log("Fetch successful");
		})
		.catch(function(error){
			log("ERROR - Fetch failed: ", error);
		});
}

window.addEventListener('load', onReady);
