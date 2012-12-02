(function () {
  console.log ("Content-Script");

  chrome.extension.onMessage.addListener (function(message, sender) {
    var change = JSON.parse (message);
    switch (change.type) {

    case "css":
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

  });

}) ();
