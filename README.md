# RefreshJS #

If you're a UX develper or a Front-end engineer, your workflow must be
as follows:
* Change css (sass/less) or js files in your editor.
* Switch to your browser and open the webpage you're working on.
* Hit refresh (or shift+refresh) and see if changes you've made are correct.
* Go back to editor and make some more changes.
With RefreshJS you can remove this time-consuming third step.

RefreshJS is a Node.JS server that you can start on your computer and a
Chrome extension that talks with the node server. This project is
completely open-source and works locally without internet, so you don't
have to worry about using any black-boxed software or a web-service for
your work.

## Installation ##

### Requirements ###
Make sure you have node.js and npm installed.
Otherwise install them from here:
[Node.JS Download](http://nodejs.org/download/ "Node.JS Download")

### Dependencies ###
Go to your terminal and while in RefreshJS folder type:
`npm install chokidar connect`

### Start server ###
Browse to your RefreshJS repository in your terminal and type:
`node refresh.js`
Open your chrome and in your address bar, type:
`http://localhost:7725` and hit enter.

### Install chrome extension ###
To install chrome extension, you need to open
`chrome://chrome/extensions/` page (your chrome extensions page). There
is a file named `src.crx` in your `RefreshJS/extensions/chrome/`
folder. Drag that file and drop it onto 'extensions' page. And click
'Add'.

### Adding a project ###
On `http://localhost:7725` you can add, edit or delete your projects.
You can watch only css folder if you want. Add hosts you work on in domains.

## Internal working ##
Chrome extension has a background-script and content-script.
Background-script talks with node server using 'EventSource'. Node
server watches the folders mentioned in configurator. Whenever a file
changes node server notifies background-script. Which inturn passes the
message to content-script available on domains mentioned in
configurator. Content script looks for css file adds a 'fake' parameter
in css file which makes the webpage to fetch latest file.

## Coming up next ##
* A firefox extension.
* Small script that you can add to your page in development
  environment which will help updating files on Dear ol' Internet
  Explorer or tablets where hard-refreshing is even more painful.

## Contact ##
You can contact me anytime. Here's my contact information -
* Website: [prajwalit.com](http://prajwalit.com "Prajwalit.com")
* Twitter: @[Prajwalit](http://twitter.com/prajwalit "Twitter handle:
  Prajwalit")
* Email: [contact at prajwalit dot com](mailto:contact@prajwalit.com "Contact [at]
  prajwalit [dot] com")

## Checkout ##
* [chokidar](https://github.com/paulmillr/chokidar "A neat wrapper around node.js fs.watch / fs.watchFile.")
* [connect](https://github.com/senchalabs/connect "Connect")
