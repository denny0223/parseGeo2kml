require('./config.js');

var Parse = require('parse').Parse;
var js2xmlparser = require("js2xmlparser");
var jsdom = require("jsdom").jsdom;
var serializeDocument = require("jsdom").serializeDocument;

Parse.initialize(parseAppId, parseJSKey);

var Post = Parse.Object.extend("Post");
var doc = jsdom(undefined);

args = process.argv.slice(2);
skip = args[0];

var query = new Parse.Query(Post);
query.notEqualTo("location", null);
query.include("user");
if (skip != undefined) query.skip(skip);
query.descending("createdAt");
query.limit(1000);
query.find({
  success: function(posts) {
    for (var i = 0; i < posts.length; ++i) {
      toPlacemarkKml(posts[i]);
    }
  }
});

function toPlacemarkKml (post) {
  user = post.get("user");

  var html = doc.createElement("div");
  html.innerHTML = post.id + "<br>";

  html.innerHTML += user.get('username') + "<br>";
  html.innerHTML += post.get('message') + "<br>";


  img = doc.createElement('img');
  img.src = "https://example.com" + post.get('thumbPath');
  img.width = 300;
  html.appendChild(img);

  var data = {
      "name": post.id,
      "styleUrl": "#" + post.get('provider'),
      "Point": {
        "coordinates": post.get('location')._longitude + "," + post.get('location')._latitude
      },
      "ExtendedData": {
        "Data": {
          "@": {
              "name": "img"
          },
          "value": {
            "#": serializeDocument(html)
          }
        }
      }
  };

  var options = {
      declaration: {
        include: false
      },
      useCDATA: true
  };

  console.log(js2xmlparser("Placemark", data, options));
}
