/**
 * Main RefreshJS Node server. Includes - Watchr/Router.
 * @author Prajwalit Bhopale <contact@prajwalit.com>
 * @created Dec 1, 2012
 * @module refresh
 * @requires connect
 */

var http = require ("http");
var fs = require ("fs");
// There's small a problem with watchr. So copying it for now.
var chokidar = require ("chokidar");
var app = require ("connect") ();
var qs = require ("querystring");
var connection, watcher, settings, domains;


// Routes
app.use ("/static/", function (request, response) {
  var url = request.url.split ("?") [0];
  var type = url.split (".");
  type = type [type.length - 1];

  switch (type) {
  case "css":
    response.setHeader ("Content-Type", "text/css");
    break;
  case "js":
    response.setHeader ("Content-Type", "application/javascript");
    break;
  case "png":
  case "jpg":
  case "jpeg":
  case "gif":
    response.setHeader ("Content-Type", "image/" + type);
    break;
  }
  response.end (fs.readFileSync ("resources/static" + url));
});

// SSE path
app.use ("/watch/", function (request, response) {
  response.writeHead (200, {
    "content-type" : "text/event-stream",
    "cache-control": "no-cache",
    "connection"   : "keep-alive"
  });

  // @TODO Handle multiple connections
  connection = response;
  request.on ("close", function () {
    connection = null;
  });
});

// iframe in background page of chrome-extension
app.use ("/background/", function(request, response) {
  response.setHeader ("Content-Type", "text/html");
  response.end (fs.readFileSync ("templates/background.html"));
});

// Settings XHR
app.use ("/settings/", function(request, response) {
  if (request.method === "GET") {
    response.setHeader ("Content-Type", "application/json");
    response.end (fs.readFileSync ("settings.json"));
  } else if (request.method === "POST") {
    response.setHeader ("Content-Type", "application/json");
    response.end ("{success:true}");

    var body = "";
    request.on ("data", function (data) {
      body += data;
    });
    request.on ("end", function () {
      fs.writeFile ("settings.json", qs.parse (body).settings);
      settings = JSON.parse (qs.parse (body).settings);
      updateWatcher (true);
    });
  }
});

// Configurator home
app.use ("/", function(request, response) {
  response.setHeader ("Content-Type", "text/html");
  response.end (fs.readFileSync ("templates/index.html"));
});


function fileUpdateHandler (filePath) {
  var fileType = filePath.split (".") [1];
  var fileName = filePath.split ("/");
  fileName = fileName [fileName.length - 1];
  // console.log ("File changed: " + fileName);
  var message = JSON.stringify ({
    type: fileType,
    name: fileName
  });

  sendUpdate ("file-update", message);
};

// File Watcher
function updateWatcher (updateDomains) {

  var i;
  if (watcher) {
    watcher.close ();
  }

  var paths = [], projs = settings.projects;

  for (i=0; i<projs.length; i+=1) {
    var p = projs [i];
    if (p.css) {
      paths.push (p.css);
    }
    if (p.images) {
      paths.push (p.images);
    }
    if (p.js) {
      paths.push (p.js);
    }
    if (p.fonts) {
      paths.push (p.fonts);
    }
  }

  if (paths.length) {
    console.log ("Watching:\n" + paths.join (",\n"));
    watcher = chokidar.watch (paths, {ignored: /^\./, persistent: true});
    watcher.on ("add", fileUpdateHandler);
    watcher.on ("change", fileUpdateHandler);
  }

  domains = [];
  for (i=0; i<settings.projects.length; i+=1) {
    domains = domains.concat (settings.projects [i].domains);
  }

  if (updateDomains) {
    sendUpdate ("domains-update", JSON.stringify (domains));
  }
}

// Create Settings File if not already present
if (!fs.existsSync ("settings.json")) {
  fs.readFile ("defaultSettings.json", function (err, content) {
    fs.writeFile ("settings.json", content, function () {
      console.log ("Settings file updated");
      settings = JSON.parse (fs.readFileSync ("settings.json"));
      updateWatcher ();
    });
  });
} else {
  settings = JSON.parse (fs.readFileSync ("settings.json"));
  updateWatcher ();
}

// Send Server Side Event (EventSource)
function sendUpdate (event, message) {
  if (!connection) {
    return;
  }
  var data = "";
  if (event) {
    data += "event: " + event + "\n";
  }
  if (message) {
    data += "data: " + message + "\n";
  }
  data += "\n"; // final part of message
  connection.write (data);
}

// After server starts, tell all content-scripts which domains to watch.
setTimeout (function () {
  sendUpdate ("domains-update", JSON.stringify (domains));
}, 2500);

// Lets Go!
app.listen (7725);
console.log ("Cool! Now go to - http://localhost:7725");
