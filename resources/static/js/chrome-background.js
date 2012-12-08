console.log ("Chrome Background");

var connected = true, domains = [];

window.addEventListener ("message", function (e) {
  var msg = JSON.parse (e.data);

  sendMsgToContentScripts (e.data);

  if (msg.msgType === "domains-update") {
    domains = JSON.parse (msg.data);
  }
}, false);

function sendMsgToContentScripts (messageData) {
  chrome.tabs.query ({}, function (tab) {
    for (var i=0; i<tab.length; i+=1) {
      chrome.tabs.sendMessage (tab [i].id, messageData);
    }
  });
};

chrome.extension.onRequest.addListener (function(request, sender, sendResponse) {
  if (request === "get-domains") {
    var message = {
      msgType: "domains-update",
      data: JSON.stringify (domains)
    }
    sendMsgToContentScripts (JSON.stringify (message));
  }
});

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

var intr = window.setInterval (function () {
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
