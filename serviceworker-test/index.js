var targetUrl = "https://dpa99c.github.io/test/mailto.html";

function onReady(){
	log("Fetching target URL");

	navigator.serviceWorker.addEventListener('message', event => {
		log("service worker: "+event.data.msg);
	});

	fetch(targetUrl)
		.then(function(){
			log("Fetch successful");
		})
		.catch(function(error){
			log("ERROR - Fetch failed: ", error);
		});
}

window.addEventListener('load', onReady);
