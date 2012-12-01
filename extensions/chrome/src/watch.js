(function () {
  console.log ("Content-Script");

  chrome.extension.onMessage.addListener (function(message, sender) {
    console.log (message);
    var links = document.getElementsByTagName ("link");
    for (var i=0; i<links.length; i++) {
      var link = links [i];
      if (link.href.indexOf (message) !== -1) {
        var newHref = link.href.split ("?") [0];
        newHref += "?forceReload=" + new Date ().getTime ();
        link.href = newHref;
      }
    }
  });

}) ();
