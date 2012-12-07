var intr = window.setInterval (function () {
  var img = document.getElementById ("connection-test");
  if (img) {
    img.parentNode.removeChild (img);
  }
  img = document.createElement ("img");
  img.id = "connection-test";
  img.src = "http://localhost:7725/static/images/1x1.png";
  img.onerror = function () {
    console.log ("Not connected");
  }
  img.onload = function () {
    console.log ("Connection established");

    window.clearInterval (intr);
    img.parentNode.removeChild (img);
    onConnect ();
  }
  document.body.appendChild (img);
}, 10000);

var onConnect =  function () {
  var script = document.createElement ("script");
  script.src = "http://localhost:7725/static/js/chrome-background.js";
  document.body.appendChild (script);
};
