/**
 * @author Prajwalit Bhopale <contact@prajwalit.com>
 * @created Dec 1, 2012
 * @module server
 * @requires connect
 */

var http = require ("http");
var fs = require ("fs");
var watchr = require ("watchr");
var app = require ("connect") ();
var qs = require ("querystring");
var connection, currentWatcher;


// Routes
app.use ("/static/", function (request, response) {
  var url = request.url.split ("?") [0];
  response.end (fs.readFileSync ("resources/static" + url));
});

// SSE path
app.use ("/watch/", function (request, response) {
  response.writeHead (200, {
    "content-type" : "text/event-stream",
    "cache-control": "no-cache",
    "connection"   : "keep-alive"
  });
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
    console.log ("Sending Settings");
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
      updateWatcher ();
    });
  }

});

app.use ("/", function(request, response) {
  response.setHeader ("Content-Type", "text/html");
  response.end (fs.readFileSync ("templates/index.html"));
});


// File Watcher
function updateWatcher () {

  if (currentWatcher) {
    currentWatcher.close ();
    console.log ("Restarting watcher");
  } else {
    console.log ("Starting watcher");
  }

  watchr.watch ({
    path: "/Users/prajwalit/playground/repos/refreshjs/resources/static/css",
    listener: function(eventName, filePath) {
      if (eventName === "change") {
        console.log ("Update");
        var fileType = filePath.split (".") [1];
        var fileName = filePath.split ("/");
        fileName = fileName [fileName.length - 1];
        if (connection) {
          sendFileUpdate ("update", fileName);
        } else {
          console.log ("Connection Lost.");
        }
      }
    },
    next: function(err, watcher) {
      if (err)  throw err;
      currentWatcher = watcher;
    }
  });
}


// Create Settings File if not already present
if (!fs.existsSync ("settings.json")) {
  fs.readFile ("defaultSettings.json", function (err, content) {
    fs.writeFile ("settings.json", content, function () {
      console.log ("Settings file updated");
      updateWatcher ();
    });
  });
} else {
  updateWatcher ();
}

// Send Server Side Event (EventSource)
function sendFileUpdate (event, message) {
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

// Lets Go!
app.listen (7725);
console.log ("Cool! Now go to - http://localhost:7725");
