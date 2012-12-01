console.log ("Chrome Background");

window.addEventListener ("message", function (e) {
  chrome.tabs.query ({}, function (tab) {
    for (var i=0; i<tab.length; i+=1) {
      chrome.tabs.sendMessage (tab [i].id, e.data);
    }
  });
}, false);
