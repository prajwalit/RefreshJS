/**
 * Watcher script. Watches our for updates from server, and refreshes
 * the appropriate content whenever server sends the report.
 * @author Prajwalit Bhopale <contact@prajwalit.com>
 * @created Dec 2, 2012
 * @module watch
 * @requires
 */

(function () {
  var domains = [], refreshActive = false;

  chrome.extension.onMessage.addListener (function(message, sender) {
    var msgObj = JSON.parse (message);

    if (msgObj.msgType === "file-update") {

      if (!refreshActive) {
        return;
      }

      var change = JSON.parse (msgObj.data);

      switch (change.type) {

      case "css":
        // console.log ("CSS updated: " + change.name);
        refresh.css (change.name);
        break;

      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        // console.log ("Image updated: " + change.name);
        refresh.image (change.name);
        refresh.css (true);
        break;

      case "js":
        // console.log ("JS updated: " + change.name);
        refresh.js (change.name);
        break;

      case "eot":
      case "svg":
      case "ttf":
      case "woff":
        // console.log ("Font updated: " + change.name);
        refresh.css (true);
        break;
      }

    } else if (msgObj.msgType === "domains-update") {
      domains = JSON.parse (msgObj.data);
      refreshActive = domains.indexOf (window.location.host) !== -1;
    }
  });

  // Ask for domains
  chrome.extension.sendRequest ("get-domains");


  var refresh = {

    css: function (name) {
      var all = typeof name === "boolean" && all;
      var links = document.getElementsByTagName ("link");
      for (var i = 0; i < links.length; i++) {
        var link = links [i];
        if (all || link.href.indexOf (name) !== -1) {
          var newHref = link.href.split ("?") [0];
          newHref += "?forceReload=" + new Date ().getTime ();
          link.href = newHref;
        }
      }
    },

    image: function (name) {
      var images = document.getElementsByTagName ("img");
      for (var i = 0; i < images.length; i++) {
        var image = image [i];
        if (image.src.indexOf (name) !== -1 || all) {
          var newSrc = image.src.split ("?") [0];
          newSrc += "?forceReload=" + new Date ().getTime ();
          image.src = newSrc;
        }
      }
    },

    js: function (name) {
      var scripts = document.getElementsByTagName ("script");
      for (var i = 0; i < scripts.length; i++) {
        var js = scripts [i];
        if (js.src.indexOf (name) !== -1) {
          window.location.reload ();
        }
      }
    }
  };

  // Hide "install extension" message on configurator page.
  if (window.location.host === "localhost:7725") {
    document.documentElement.setAttribute ("class", "extension-enabled");
  }

}) ();
