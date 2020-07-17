var targetUrl = "https://dpa99c.github.io/test/mailto.html";

navigator.serviceWorker.addEventListener('message', event => {
	log("service worker: "+event.data.msg);
	if(event.data.msg === "activating"){
		window.serviceWorkerActivated = true;
		document.dispatchEvent(new Event("service-worker-activated"));
	}
});

function onReady(){
	log("Fetching target URL");

	if(serviceWorkersNotSupported || serviceWorkerActivated){
		doFetch();
	}else{
		document.addEventListener("service-worker-activated", doFetch, false);
	}
}

function doFetch(){
	fetch(targetUrl)
		.then(function(){
			log("Fetch successful");
		})
		.catch(function(error){
			log("ERROR - Fetch failed: ", error);
		});
}

window.addEventListener('load', onReady);
