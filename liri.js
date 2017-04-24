var twitCred = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('spotify');
var Request = require('request');

var liriCmd = process.argv[2];
var liriPara = process.argv[3];

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
        Spotify.search({  type:   'track',  query:  liriPara  },  function(err,  data)  {    
            if  ( err )  {        
                console.log('Error occurred: '  +  err);        
                return;    
            } 
            console.log('======================');
            console.log(data.tracks.items[0].album.artists[0].name);
            console.log('======================');
            console.log(data.tracks.items[0].name);
            console.log('======================');
            console.log(data.tracks.items[0].preview_url);
            console.log('======================');
            console.log(data.tracks.items[0].album.name);
            console.log('======================');

        });
        break;
    case 'movie-this':
        var queryUrl = "http://www.omdbapi.com/?t=" + liriPara  + "&y=&plot=short&r=json";
        Request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(JSON.parse(body).Title);
                console.log(JSON.parse(body).Year);
                console.log(JSON.parse(body).imdbRating);
                console.log(JSON.parse(body).Country);
                console.log(JSON.parse(body).Language);
                console.log(JSON.parse(body).Plot);
                console.log(JSON.parse(body).Actors);
                console.log(JSON.parse(body).Ratings[1].Source);
                console.log(JSON.parse(body).Ratings[1].Value);
            }
        });
        break;
    case 'do-what-it-says':
        console.log('do-what-it-says');
        break;
}
