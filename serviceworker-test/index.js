var targetUrl = "content.json";
var serviceWorkerPath = 'serviceworker.js';

function areServiceWorkersAvailable(){
	return 'serviceWorker' in navigator;
}

function log(msg){
	if(document.body) document.body.innerHTML += '<p>'+msg+'</p>';
	console.log(msg);
}

function setupSW(){
	if(areServiceWorkersAvailable()) {
		// Register as service worker
		log('Service Workers available -  registering...');
		navigator.serviceWorker.register(serviceWorkerPath).then(function (registration) {
			log('Service Worker registered');
			var swActivated = false;

			function onActivated(){
				if(swActivated) return;
				swActivated = true;
				log('Service Worker activated');
				onServiceWorkerReady();
			}

			function checkActive(){
				if (registration.active) {
					if(registration.active.state === "activated"){
						onActivated();
					}else{
						log('Service Worker activating');
						registration.active.addEventListener('statechange', onActivated);
					}
				}
			}

			if (registration.installing) {
				log('Service Worker installing');
				registration.installing.addEventListener('statechange', function() {
					if(navigator.serviceWorker.controller && registration.installing && registration.installing.state === 'installed'){
						log('Existing Service Worker updated');
						checkActive();
					} else if (registration.installing && registration.installing.state === 'installed'){
						log('New Service Worker installed');
						checkActive();
					}else{
						checkActive();
					}
				});
			}else{
				checkActive();
			}
		});
	}else{
		// Load as script
		log("Service Workers are not available: falling back to load as script");
		var script = document.createElement('script');
		script.onload = function () {
			log("Service worker loaded as script");
		};
		script.src = serviceWorkerPath;
		document.head.appendChild(script);
		onServiceWorkerReady();
	}

	if(areServiceWorkersAvailable()){
		navigator.serviceWorker.addEventListener('message', event => {
			log("service worker: "+event.data.msg);
		});
	}else{
		document.addEventListener("service-worker-message", function(event){
			log("service worker as script: "+event.detail);
		}, false);
	}
}


function onReady(){
	setupSW();
}

function onServiceWorkerReady(){
	doFetch();
}

function doFetch(){
	log("Fetching target URL");
	if(areServiceWorkersAvailable()){
		log("Service worker controller defined: "+!!navigator.serviceWorker.controller);
		if(navigator.serviceWorker.controller){
			log("Service worker state: "+navigator.serviceWorker.controller.state);
		}
	}

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
