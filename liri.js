var twitCred = require('./keys.js');
var Twitter = require('twitter');
var liriCmd = process.argv[2];

var client = new Twitter({
    consumer_key: twitCred.twitterKeys.consumer_key,
    consumer_secret: twitCred.twitterKeys.consumer_secret,
    access_token_key: twitCred.twitterKeys.access_token_key,
    access_token_secret: twitCred.twitterKeys.access_token_secret
});

switch (liriCmd) {
    case 'my-tweets':
        var params = { screen_name: 'dlphillips' };
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                // console.log(tweets);
                for (var i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].text);
                    console.log(tweets[i].created_at);
                }
            }
        });
        break;
    case 'spotify-this-song':
    	console.log('spotify-this-song');
        break;
    case 'movie-this':
    	console.log('movie-this');
        break;
    case 'do-what-it-says':
    	console.log('do-what-it-says');
        break;
}
