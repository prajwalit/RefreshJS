console.log ("Hello RefreshJS.");

var source = new EventSource ("/watch/");

source.addEventListener ("update", function (e) {
  window.top.postMessage (e.data, "*");
  //console.log ("Update: " + e.data);
}, false);
