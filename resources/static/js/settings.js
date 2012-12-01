(function () {

  $.getJSON ("/settings/", function (data) {
    $ ("#path-inp").val (data.path);
  });

  $ ("#settings-form").submit (function (event) {
    $.post ("/settings/", {
      settings: JSON.stringify ({
        "path": $("#path-inp").val ()
      })
    }, function () {
      console.log ("Done Posting");
    });
    return false;
  });

}) ();
