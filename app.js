require('dotenv').config();
var gb = require('geckoboard')(process.env.API_KEY);
var Twitter = require('twitter');
var lastRetweetId = 1;
var client = new Twitter({
  consumer_key: process.env.TW_API_KEY,
  consumer_secret: process.env.TW_API_SECRET,
  access_token_key: process.env.TW_ACCESS_TOKEN,
  access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET
});

callTwitter();


function callTwitter(){

  client.get('statuses/retweets_of_me', {since_id: lastRetweetId}, 
    function(error, retweets, response){
    if(error){
      console.log(error);
      return;
    }

    var retweetCount = retweets.length;

    client.get('followers/ids', function(error, ids, response){
      if(error){
        console.log(error);
        return;
      }

      var followersCount = ids.ids.length
      addToGeckoboard(retweetCount, followersCount);
    });
  });
  setTimeout(callTwitter, 3600000);
}


function addToGeckoboard(retweets, followers) {
  gb.ping(function (error){
    if (error) {
      console.log(error);
      return;
    }

    console.log("Authentication Sucessful");
  });

  gb.datasets.findOrCreate(
    {
      id: 'twitter_reach.by_hour',
      fields: {
          retweets: {
          type: 'number',
          name: 'Number of retweets'
        },
        followers: {
          type: 'number',
          name: 'Number of twitter followers'
        },
        datetime: {
          type: 'datetime',
          name: 'Datetime'
        }
      }
    },
    function (error, dataset){
      if (error) {
        console.log(error);
        return;
      }

      dataset.post(
        [
        {datetime: new Date().toISOString(), retweets: retweets,
        followers: followers}
        ],
        {},
        function(error){
          if (error){
            console.log(error);
            return
          }
          console.log('Dataset created and data added');
        }
      );
    }
  );
}
