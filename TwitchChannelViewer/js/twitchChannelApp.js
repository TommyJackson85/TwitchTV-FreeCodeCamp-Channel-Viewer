$(document).ready(function() {

  var followers = ["brunofin", "comster404", "gamereactor", "burkeblack", "nick28t", "wintergaming"];
  // extra names put into followers Array: bronofin andn comster404 are users who dont exist anymore. The other three users dont follow FreeCodeCamp, they are used to make sure the app still works.
  var apiLink = "https://wind-bow.glitch.me/twitch-api"; //base link for api.
  var streamsLinkFCC = apiLink + "/streams/freecodecamp";
  // console.log(streamsLinkFCC);
  var usersChannels = apiLink + "/users/freecodecamp/follows/channels/";
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
    //this will add new followers to the the followers array above.
      for (var i = 0; i < data2.follows.length; i++) {
        var eachFollower = data2.follows[i].channel.display_name;
        followers.push(eachFollower)
      // console.log(followers);
      }

      for (var i = 0; i < followers.length; i++) {
      var followerStream = apiLink + "/streams/" + followers[i];
      //each follower's streams api link.. the channels api link can be connected to through the streams api.
     //console.log(followersStream);

      $.getJSON(followerStream).done(function(live) {
        var status;
        var name;
        var logo;
        
          if (live.stream != null) {
          //users who are currently live
              status = live.stream.channel.status;

            if (status.length > 4) {
               status =  "'" + status.slice(0, 38) + "...'"; //shortens link lenght for live channels
            }

            name = live.stream.channel.display_name;
            if(live.stream.channel.logo === null){
              logo = "http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-6.jpg"; //gives a placeholder logo if channel doesnt have a logo
            } 
            else { logo = live.stream.channel.logo; 
              }
              //console.log(logo)
            $("#online").append("<div class='online'><img src='" + logo + "' class='onlineLogo'><h6>" + name + " is Streaming:<br /> <a href='https://www.twitch.tv/" + name + "'>" + status + "</h6></a></h6></div>"); // appends status update
          };
        
        if(live.stream === null) {
        //users NOT live or who dont exist      
          var newAPIChannel = live._links.channel;
          newAPIChannel = apiLink + "/channels/" + newAPIChannel.slice(38);
          console.log(newAPIChannel);
          //newAPIChannel is a replacement of the channel link in the streams API because the other link wont work without the apiLink variable..
          $.getJSON(newAPIChannel).done(function(offline) {
          
          if (offline.error) {
          // channel users that dont exist anymore
              logo = "http://blog.extreme-advice.com/wp-content/uploads/2013/01/error.png";
              // specific logo placeholder for non existant users
              status = offline.error;
              name = offline.message;
              $("#nonUsers").append("<div class='error'><img src='" + logo + "' class='offlineLogo'><div class='offlineStat'><h6>" + name + "</h6></div></div>");
          } else {
          //users that do exist but arent online
            name = offline.display_name;
            if (offline.logo === null){
              logo = "http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-6.jpg"; // placeholder for users without logo
            } 
            else { 
              logo = offline.logo;
            }
            $("#offline").append("<div class='offline'><img src='" + logo + "' class='offlineLogo'><div class='status'><h6>" + name + " is currently <a href='https://www.twitch.tv/" + name + "'>OFFLINE</a></h6></div></div>");
        };

});
};
}); 
};  
});
});