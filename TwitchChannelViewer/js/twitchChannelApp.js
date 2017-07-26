$(document).ready(function() {

  var followers = ["brunofin", "comster404", "gamereactor", "burkeblack", "nick28t", "wintergaming"];
  // extra names put into followers Array: bronofin andn comster404 are users who dont exist anymore. The other three users dont follow FreeCodeCamp, they are used to make sure the app still works.
  var freeCodeCamp = "/freecodecamp"; //extention for FCC links
  var apiLink = "https://wind-bow.glitch.me/twitch-api"; //base link for api.
  var streamsLinkFCC = apiLink + "/streams" + freeCodeCamp;
  // console.log(streamsLinkFCC);
  
  var followerLinkChannel;
  var followerLinkStream;
  var usersChannels = apiLink + "/users" + freeCodeCamp + "/follows/channels/";
  //usersChannels links to the list of channels of FCC's followers
  //console.log(usersChannels);
  var streamsLink = apiLink + "/streams/"; //add user names at the end and an optional callBack var if required
  //console.log(streamsLink);

  //FreeCodeCamp link
  $.getJSON(streamsLinkFCC, function(data1) {
    if (data1.stream === null) {
      $("#linkFCC").append("<a href='https://www.twitch.tv/freecodecamp'>FCC's Twitch Channel is currently OFFLINE</a>");
    } else {
      $("#linkFCC").append("<a href='https://www.twitch.tv/freecodecamp'>FCC's Twitch Channel is currently ONLINE</a>");
    }
  });

  $.getJSON(usersChannels, function(data2) {
    //other users and what they are streaming
    for (var i = 0; i < data2.follows.length; i++) {
      var eachFollower = data2.follows[i].channel.display_name;
      followers.push(eachFollower)
      // console.log(followers);
    }

    for (var i = 0; i < followers.length; i++) {
      var followersStream = apiLink + "/streams/" + followers[i];
      //each follower's streams api link.. if needed it, the channels api link can be connected to through the streams api.
     // console.log(followersStream);

      $.getJSON(followersStream).done(function(live) {
        var status;
        var name;
        var logo;
        if (live.stream != null) {
          // if function for users who are currently live
          status = live.stream.channel.status;

             if (status.length > 4) {
          console.log(5 * 10); // just for reference in console.
         status =  "'" + status.slice(0, 38) + "...'";
        }

          name = live.stream.channel.display_name;
          if(live.stream.channel.logo === null){
         logo = "http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-6.jpg"; //gives a placeholder logo if channel doesnt have a logo
        } else { logo = live.stream.channel.logo; }
          //console.log(logo)
          $("#online").append("<div class='online'><img src='" + 
          logo + "' class='onlineLogo'><h6>" + name + " is Streaming:<br /> <a href='https://www.twitch.tv/" + name + "'>" + status + "</h6></a></h6></div>"); // appends status update
        };
        
        if(live.stream === null) {
          //if function for users not live of who dont exist      
      var newAPIChannel = live._links.channel;
    newAPIChannel = apiLink + "/channels/" + newAPIChannel.slice(38);
          console.log(newAPIChannel);
          //newAPIChannel is a replacement of the channel link in the streams API because the other link wont work without the apiLink variable..
      $.getJSON(newAPIChannel).done(function(offline) {
        if (offline.error) {
          // this if function is for channel users that dont exist anymore
          logo = "http://blog.extreme-advice.com/wp-content/uploads/2013/01/error.png";
          // specific logo placeholder for non existant users
          status = offline.error;
          name = offline.message;
          $("#nonUsers").append("<div class='error'><img src='" + logo + "' class='offlineLogo'><div class='offlineStat'><h6>" + name + "</h6></div></div>");
         
        } else {
          //else function for the other users that do exist but arent online
          name = offline.display_name;
          if (offline.logo === null){
         logo = "http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-6.jpg"; // placeholder for users without logo
        } else { 
            logo = offline.logo; 
         // console.log(logo)
               }
          
          $("#offline").append("<div class='offline'><img src='" + logo + "' class='offlineLogo'><div class='status'><h6>" + name + " is currently <a href='https://www.twitch.tv/" + name + "'>OFFLINE</a></h6></div></div>");
                  
          //"<div class='row'><div class='span12'><div class='online col-xs-12 col-sm-12'><img src='" + logo + "' class='onlineLogo col-xs-6 col-sm-6'><h6>" + name + "</h6><h6>" + status + "</h6></div></div></div>"
        };

      });
        };
      }); 
    };
      
  });
});