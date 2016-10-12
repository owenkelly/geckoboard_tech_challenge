require('dotenv').config();
var gb = require('geckoboard')(process.env.API_KEY);
var Twitter = require('twitter');
var lastTweetId = 1;
var lastRetweetId = 1;
var client = new Twitter({
  consumer_key: process.env.TW_API_KEY,
  consumer_secret: process.env.TW_API_SECRET,
  access_token_key: process.env.TW_ACCESS_TOKEN,
  access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET
});

var tweetCount = client.get('statuses/user_timeline', {since_id: lastTweetId, count: 100}, function(error, tweets, response){
  if(error) {
    console.log(error);
    return;
  }

  return tweets.length;
});

var retweetCount = client.get('statuses/retweets_of_me', {since_id: lastRetweetId}, function(error, retweets, response){
  if(error){
    console.log(error);
    return;
  }

  return retweets.length;
});

var followersCount = client.get('followers/ids', function(error, ids, response){
  if(error){
    console.log(error);
    return;
  }
  
  return ids.ids.length;
});


gb.ping(function (error){
  if (error) {
    console.log(error);
    return;
  }

  console.log("Authentication Sucessful");
});

gb.datasets.findOrCreate(
  {
    id: 'twitter_account.by_hour',
    fields: {
      tweets: {
        type: 'number',
        name: 'Number of tweets'
      },
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

    dataset.put(
      [
      {datetime: new Date().toISOString(), tweets: tweetCount, retweets: retweetCount,
      followers: followersCount}
      ],
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

