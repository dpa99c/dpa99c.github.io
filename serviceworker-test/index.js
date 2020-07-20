var targetUrl = "../test/mailto.html";

if(areServiceWorkersAvailable()){
	navigator.serviceWorker.addEventListener('message', event => {
		log("service worker: "+event.data.msg);
	});
}else{
	document.addEventListener("service-worker-message", function(event){
		log("service worker as script: "+event.detail);
	}, false);
}


function onReady(){
	doFetch();
}

function doFetch(){
	log("Fetching target URL");
	fetch(targetUrl)
		.then(function(response){
			log("Fetch successful");
			printResponse(response);
		})
		.catch(function(error){
			log("ERROR - Fetch failed: ", error);
		});
}

async function printResponse(response){
	const bodyText = await response.text();
	document.body.innerHTML += '<pre style="background-color: #cccccc">'+bodyText+'</pre>';
}

window.addEventListener('load', onReady);
