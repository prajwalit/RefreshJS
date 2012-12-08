/**
 * Listens to the server-sent events and passes those to
 * chrome-background script. Needed to add an iframe in
 * background page to bypass cross-site communication policy.
 * @author Prajwalit Bhopale <contact@prajwalit.com>
 * @created Dec 2, 2012
 * @module background
 * @requires
 */
(function () {

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
    domains = JSON.parse (e.data);
    window.top.postMessage (message, "*");
  }, false);

  var xhr = new XMLHttpRequest ();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var settings = JSON.parse (xhr.responseText);
      domains = [];
      for (var i = 0; i < settings.projects.length ; i+=1) {
        domains = domains.concat (settings.projects [i].domains);
      }
      var message = JSON.stringify ({
        data   : JSON.stringify (domains),
        msgType: "domains-update"
      });
      window.top.postMessage (message, "*");
    }
  };
  xhr.open ("GET", "/settings/", true);
  xhr.send (null);

}) ();
