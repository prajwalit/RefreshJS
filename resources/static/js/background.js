console.log ("Hello RefreshJS.");
var domains = [];
var source = new EventSource ("/watch/");

source.addEventListener ("file-update", function (e) {
  var message = JSON.stringify ({
    data   : e.data,
    msgType: "file-update"
  });
  window.top.postMessage (message, "*");
}, false);

source.addEventListener ("domains-update", function (e) {
    var message = JSON.stringify ({
    data   : e.data,
    msgType: "domains-update"
  });
  domains = JSON.stringify (e.data);
  window.top.postMessage (message, "*");
}, false);
