(function () {

  $.getJSON ("/settings/", function (data) {
    console.log (data);
    if (data.folders.css [0]) {
      $ ("#css-folder").val (data.folders.css [0].path);
    }
    if (data.folders.images [0]) {
      $ ("#img-folder").val (data.folders.images [0].path);
    }
    if (data.folders.js [0]) {
      $ ("#js-folder").val (data.folders.js [0].path);
    }
    if (data.folders.html [0]) {
      $ ("#html-folder").val (data.folders.html [0].path);
    }

    if (data.domains [0]) {
      $ ("#domain-0").val (data.domains [0].name);
    }
    if (data.domains [1]) {
      $ ("#domain-1").val (data.domains [1].name);
    }
  });

  $ ("#settings-form").submit (function (event) {
    $.post ("/settings/", {
      settings: JSON.stringify (buildSettingsJSON ())
    }, function () {
      console.log ("Done Posting");
    });
    return false;
  });


  function buildSettingsJSON () {
    var settings = {
      folders: {
        css: [],
        images: [],
        js: [],
        html: []
      },
      domains: [],
      backup: "",
      version: 1
    }

    if ($ ("#css-folder").val ()) {
      settings.folders.css.push ({
        path: $ ("#css-folder").val (),
        active: true
      });
    }
    if ($ ("#img-folder").val ()) {
      settings.folders.images.push ({
        path: $ ("#img-folder").val (),
        active: true
      });
    }
    if ($ ("#js-folder").val ()) {
      settings.folders.js.push ({
        path: $ ("#js-folder").val (),
        active: true
      });
    }
    if ($ ("#html-folder").val ()) {
      settings.folders.html.push ({
        path: $ ("#html-folder").val (),
        active: true
      });
    }

    if ($ ("#domain-0").val ()) {
      settings.domains.push ({
        name: $ ("#domain-0").val (),
        active: true
      })
    }
    if ($ ("#domain-1").val ()) {
      settings.domains.push ({
        name: $ ("#domain-1").val (),
        active: true
      })
    }

    return settings;
  }

}) ();
