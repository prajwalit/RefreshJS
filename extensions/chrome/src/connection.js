/**
 * Background-script for chrome extension. Script keeps checking for
 * a small 1x1px image from node server. When it gets it, it passes
 * the control to chrome-background.js
 * @author Prajwalit Bhopale <contact@prajwalit.com>
 * @created 8 Dec, 2012
 * @module connection
 * @requires
 */

function checkConnection () {
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
}

var intr = window.setInterval (checkConnection, 10000);
checkConnection ();

var onConnect =  function () {
  var script = document.createElement ("script");
  script.src = "http://localhost:7725/static/js/chrome-background.js";
  document.body.appendChild (script);
};
