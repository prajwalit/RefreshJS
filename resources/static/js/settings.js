/**
 * JS for settings/configurator page of RefreshJS
 * @author Prajwalit Bhopale <prajwalit@helpshift.com>
 * @created Dec 2, 2012
 * @module settings
 * @requires jQuery
 */

(function () {

  // Get latest settings
  $.getJSON ("/settings/", function (data) {
    for (var i=0; i<data.projects.length; i+=1) {
      var p = data.projects [i];
      var nodeTmpl = getProjectTmpl (p, i);
      $ (".new-project-wrapper").before (nodeTmpl);
    }
  });

  // Listen for Project edits
  $ (".projects-wrapper").delegate (".edit", "click", function (event) {
    var wrapper = $ (event.currentTarget).closest (".project");
    var domains = [];
    if (wrapper.find (".domain-1").text () !== "-") {
      domains.push (wrapper.find (".domain-1").text ());
    }
    if (wrapper.find (".domain-2").text () !== "-") {
      domains.push (wrapper.find (".domain-2").text ());
    }
    var data = {
      id     : wrapper.attr ("data_id"),
      name   : wrapper.find ("h4").text (),
      css    : wrapper.find (".css").text () !== "-" ? wrapper.find (".css").text () : "",
      images : wrapper.find (".images").text () !== "-" ? wrapper.find (".images").text () : "",
      js     : wrapper.find (".js").text () !== "-" ? wrapper.find (".js").text () : "",
      fonts  : wrapper.find (".fonts").text () !== "-" ? wrapper.find (".fonts").text () : "",
      domains: domains
    };
    openModal (data);
  });

  // Listen for Project deletes
  $ (".projects-wrapper").delegate (".delete", "click", function (event) {
    var et = $ (event.target);
    var top = et.position ().top;
    var left = et.position ().left;
    $ (".delete-wrapper").show ().css ({
      top : (top + 27) + "px",
      left: (left - 202) + "px"
    }).attr ("project_id", et.closest (".project").attr ("data_id"));
  });

  // Hide delete wrapper on body-click
  $ ("body").click (function (event) {
    var et = $ (event.target);
    if ((!et.hasClass ("delete") && !et.closest (".delete-wrapper").length) ||
        et.hasClass ("delete-cancel")) {
      $ (".delete-wrapper").hide ();
    }
  });

  // Delete project handler
  $ ("#delete-accept").click (function () {
    var toDelete = $ (".delete-wrapper").hide ().attr ("project_id")*1;
    $ (".projects-wrapper .project").each (function (index, node) {
      if (index === toDelete) {
        $ (node).remove ();
      } else if (index > toDelete) {
        $ (node).attr ("data_id", (index - 1));
      }
    });
    updateSettingsJSON ();
  });

  // new-project modal handler
  $ ("#new-project").click (function (event) {
    openModal ();
  });

  // Close modal handler
  $ (".modal-close").click (function (event) {
    $ ("#modal-bg, #modal").addClass ("hidden");
  });

  // Create / Edit project form submit handler
  $ ("#project-form").submit (function (event) {

    var projectData = getFormData ();
    $ ("#modal-bg, #modal").addClass ("hidden");

    var creatingNew = $ ("#project-index").val () === "-1";
    if (creatingNew) {
      var nextIndex = $ (".projects-wrapper .project").length;
      $ (".new-project-wrapper").before (getProjectTmpl (projectData, nextIndex));
    } else {
      var index = $ ("#project-index").val ();
      var node = $ (".projects-wrapper .project") [index * 1];
      $ (node).replaceWith (getProjectTmpl (projectData, index * 1));
    }

    updateSettingsJSON ();

    return false;
  });

  // create project markup
  function getProjectTmpl (p, index) {
    var nodeTmpl = $ ("#project-tmpl").html ();
    return nodeTmpl.replace ("{{name}}", p.name || ("New Project " + index))
      .replace ("{{index}}", index)
      .replace (/{{css}}/g, p.css || "-")
      .replace (/{{images}}/g, p.images || "-")
      .replace (/{{js}}/g, p.js || "-")
      .replace (/{{fonts}}/g, p.fonts || "-")
      .replace ("{{domain-1}}", p.domains [0] || "-")
      .replace ("{{domain-2}}", p.domains [1] || "-");
  };

  // Build new settings JSON and post to server.
  function updateSettingsJSON () {
    var settings = {
      projects: [],
      backup  : "",
      version : 1
    };

    $ (".projects-wrapper .project").each (function (index, node) {
      var n = $ (node), domains = [];
      if (n.find (".domain-1").text () !== "-") {
        domains.push (n.find (".domain-1").text ());
      }
      if (n.find (".domain-2").text () !== "-") {
        domains.push (n.find (".domain-2").text ());
      }
      settings.projects.push ({
        active : true,
        name   : n.find ("h4").text (),
        css    : n.find (".css").text () !== "-" ? n.find (".css").text () : "",
        images : n.find (".images").text () !== "-" ? n.find (".images").text () : "",
        js     : n.find (".js").text () !== "-" ? n.find (".js").text () : "",
        fonts  : n.find (".fonts").text () !== "-" ? n.find (".fonts").text () : "",
        domains: domains
      });
    });

    $.post ("/settings/", {
      settings: JSON.stringify (settings)
    }, function () {
      console.log ("Done Updating!");
    });
  }

  // On before modal open changes
  function openModal (data) {
    var creatingNew = !data;
    $ ("#modal-bg, #modal").removeClass ("hidden");

    $ ("#project-index").val (creatingNew ? "-1" : data.id);
    $ ("#modal-title").text (creatingNew ? "Create new project" : "Edit project");
    $ ("#modal-submit").text (creatingNew ? "Create!" : "Edit!");
    $ ("#project-title").val (creatingNew ? "" : data.name).focus ();
    $ ("#css-folder").val (creatingNew ? "" : data.css);
    $ ("#images-folder").val (creatingNew ? "" : data.images);
    $ ("#js-folder").val (creatingNew ? "" : data.js);
    $ ("#fonts-folder").val (creatingNew ? "" : data.fonts);
    $ ("#domain-1-inp").val (creatingNew ? "" : data.domains [0]);
    $ ("#domain-2-inp").val (creatingNew ? "" : data.domains [1]);
  }

  // Gets new / edited project's data
  function getFormData () {
    var domains = [];
    if ($ ("#domain-1-inp").val ()) {
      domains.push ($ ("#domain-1-inp").val ());
    }
    if ($ ("#domain-2-inp").val ()) {
      domains.push ($ ("#domain-2-inp").val ());
    }
    return {
      active : true,
      name   : $ ("#project-title").val (),
      css    : $ ("#css-folder").val (),
      images : $ ("#images-folder").val (),
      js     : $ ("#js-folder").val (),
      fonts  : $ ("#fonts-folder").val (),
      domains: domains
    };
  }

  // Wait till content-script triggers, remove display:none of
  // "install chrome extension extension wrapper"
  $ (document).ready (function () {
    setTimeout (function () {
      $ (".instructions-wrapper").attr ("style", "");
    }, 1000);
  });

}) ();
