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
        console.log ("CSS updated: " + change.name);
        var links = document.getElementsByTagName ("link");
        for (var i=0; i<links.length; i++) {
          var link = links [i];
          if (link.href.indexOf (change.name) !== -1) {
            var newHref = link.href.split ("?") [0];
            newHref += "?forceReload=" + new Date ().getTime ();
            link.href = newHref;
          }
        }
        break;

      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        console.log ("Image updated: " + change.name);
        break;

      case "js":
        console.log ("JS updated: " + change.name);
        break;

      case "html":
        console.log ("HTML updated: " + change.name);
        break;
      }

    } else if (msgObj.msgType === "domains-update") {
      domains = JSON.parse (msgObj.data);
      refreshActive = domains.indexOf (window.location.host) !== -1;
    }
  });

  // Ask for domains
  chrome.extension.sendRequest ("get-domains");

}) ();
