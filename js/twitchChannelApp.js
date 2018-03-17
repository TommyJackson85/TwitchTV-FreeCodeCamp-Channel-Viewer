$(document).ready(function() {
  var followers = [
    "brunofin",
    "comster404",
    "gamereactor",
    "burkeblack",
    "nick28t",
    "wintergaming"
  ];
  // extra names put into followers Array: bronofin andn comster404 are users who dont exist anymore. The other three users dont follow FreeCodeCamp, they are used to make sure the app still works.
  var apiReplacement = "https://wind-bow.glitch.me/twitch-api"; //new link for api (original FCC's doesnt work).
  var streamsLinkFCC = apiReplacement + "/streams/freecodecamp";
  var usersChannels = apiReplacement + "/users/freecodecamp/follows/channels/";
  //usersChannels links to the list of channels of FCC's followers

  var streamsLink = apiReplacement + "/streams/"; //add user names at the end and an optional callBack var if required
  var FCCtwitchStatus = "FCC's Twitch Channel is currently %data%";

  //FreeCodeCamp link
  $.getJSON(streamsLinkFCC, function(data1) {
    if (data1.stream === null) {
      FCCtwitchStatus = FCCtwitchStatus.replace("%data%", "OFFLINE");
    } else {
      FCCtwitchStatus = FCCtwitchStatus.replace("%data%", "ONLINE");
    }
    $(".linkFCC").text(FCCtwitchStatus);
  });

  $.getJSON(usersChannels, function(data2) {
    //other users and what they are streaming
    //this will add new followers to the the followers array above.
    for (var i = 0; i < data2.follows.length; i++) {
      var eachFollower = data2.follows[i].channel.display_name;
      followers.push(eachFollower);
    }

    for (var i = 0; i < followers.length; i++) {
      var userChannel = apiReplacement + "/streams/" + followers[i];
      //each follower's streams api link.. the channels api link can be connected to through the streams api.

      $.getJSON(userChannel).done(function(channel) {
        /*Variables that maybe used for all three user types. (i.e. Online, Offline, NonUsers)*/
        var status;
        var name; 
        var streamTitle; //for online users only
        var addLink = function addLink(linkID, linkClass, logo, logoClass, status) {
          $(linkID).append(
            $("<div>")
              .addClass(linkClass)
              .html(
                "<img src='" +
                  logo +
                  "' class='" +
                  logoClass +
                  "' /><h6>" +
                  status +
                  "</h6>"
              )
          );
        };
        var optionalLogo = function (logoLink){
          //if users don't have a logo.
          if (logoLink === null) {
                logo =
                  "http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-6.jpg"; // placeholder for users without logo
              } else {
                logo = logoLink;
              }
               return logo;
            }

        /*IF users are Online, this following happens*/
        if (channel.stream != null) {
          name = channel.stream.channel.display_name;
          streamTitle = channel.stream.channel.status;
          if (streamTitle.length > 4) {
            streamTitle = "'" + streamTitle.slice(0, 38) + "...'"; //shortens link lenght for live channels
          }
          
          status = 
            name +
            " is streaming:</br> " +
            "<a href='https://www.twitch.tv/" +
            name +
            "'>" +
            streamTitle +
            "</a>";
          logo = optionalLogo(channel.stream.channel.logo);

            //addLink(linkID, linkClass, logo, logoClass, status)
          addLink("#online", "online", logo, "onlineLogo", status);
        }

        /*IF users are NonExisting, this following happens*/
        if (channel.stream === null) {
          var newAPIChannel = channel._links.channel;
          newAPIChannel = apiReplacement + "/channels/" + newAPIChannel.slice(38);

          console.log(newAPIChannel);
          //newAPIChannel is a replacement of the channel link in the streams API because the other link wont work without the apiReplacement.
          $.getJSON(newAPIChannel).done(function(offline) {
            if (offline.error) {
              // channel users that dont exist anymore

              status = "ERROR : " + offline.message;
                logo =
                "http://blog.extreme-advice.com/wp-content/uploads/2013/01/error.png";
                 // specific logo placeholder for non existant users
               addLink("#nonUsers", "error", logo, "offlineLogo", status);
            } 
            
            /*ELSE if users exist but are offline, this following happens*/
            else {
              name = offline.display_name;
              status =
                name +
                " is currently <a href='https://www.twitch.tv/" +
                name +
                "'>OFFLINE</a>";
               logo = optionalLogo(offline.logo);
          addLink("#offline", "offline", logo, "offlineLogo", status);
            }
          });
        }
      });
    }
  });
});