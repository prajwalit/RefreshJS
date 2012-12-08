/**
 * Seats in chrome-extension's background page. Listens to SSE messages
 * passed by background.js and passes those to content scripts.
 * Keeps checking server's up status.
 * @author Prajwalit Bhopale <contact@prajwalit.com>
 * @created Dec 2, 2012
 * @module chrome-background
 * @requires
 */

var connected = true, domains = [];

// Listen for SSL updates from background.js
window.addEventListener ("message", function (e) {
  var msg = JSON.parse (e.data);

  sendMsgToContentScripts (e.data);

  if (msg.msgType === "domains-update") {
    domains = JSON.parse (msg.data);
  }
}, false);

// Send update messages to all content scripts
function sendMsgToContentScripts (messageData) {
  chrome.tabs.query ({}, function (tab) {
    for (var i=0; i<tab.length; i+=1) {
      chrome.tabs.sendMessage (tab [i].id, messageData);
    }
  });
};

// Send domain list when new content-script joins
chrome.extension.onRequest.addListener (function(request, sender, sendResponse) {
  if (request === "get-domains") {
    var message = {
      msgType: "domains-update",
      data: JSON.stringify (domains)
    }
    sendMsgToContentScripts (JSON.stringify (message));
  }
});

// Load/Reload iframe with local page to start listening to SSEs
var iframeReload = function () {
  var frame = document.getElementById ("bg-frame");
  if (frame) {
    frame.parentNode.removeChild (frame);
  }
  frame = document.createElement ("iframe");
  frame.id = "bg-frame";
  frame.src = "http://localhost:7725/background/";
  document.body.appendChild (frame);
};
iframeReload ();

// Keep checking server's up status
window.setInterval (function () {
  var img = document.getElementById ("connection-test");
  if (img) {
    img.parentNode.removeChild (img);
  }
  img = document.createElement ("img");
  img.id = "connection-test";
  img.src = "http://localhost:7725/static/images/1x1.png";
  img.onerror = function () {
    console.log ("Connection Broke!");
    connected = false;
  }
  img.onload = function () {
    if (!connected) {
      console.log ("Connection established again.");
      iframeReload ();
      connected = true;
    }
  }
  document.body.appendChild (img);
}, 10000);
