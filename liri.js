var twitCred = require('./keys.js');
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

var client = new twitter({
    consumer_key: twitCred.twitterKeys.consumer_key,
    consumer_secret: twitCred.twitterKeys.consumer_secret,
    access_token_key: twitCred.twitterKeys.access_token_key,
    access_token_secret: twitCred.twitterKeys.access_token_secret
});

var liriCmd = process.argv[2];
var liriPara = process.argv[3];

var getRandom = function() {
    return new Promise(function(resolve, reject) {
        fs.readFile('random.txt', 'utf8', function(error, data) {
            liriCmd = data.split(",")[0];
            liriPara = data.split(",")[1];
            resolve('file read');
        });
    });
};

var getCall = function(message) {
    return new Promise(function(resolve, reject) {
        doSomething(liriCmd, liriPara);
        resolve(message + ' , var assigned');
    });
};

switch (liriCmd) {
    case 'my-tweets':
        if (liriPara === undefined) {
            doSomething(liriCmd, "dlphillips");
        } else {
            doSomething(liriCmd, liriPara);
        }
        break;
    case 'spotify-this-song':
        if (liriPara === undefined) {
            doSomething(liriCmd, "The Sign Ace of Base");
        } else {
            doSomething(liriCmd, liriPara);
        }
        break;
    case 'movie-this':
        if (liriPara === undefined) {
            doSomething(liriCmd, "Mr. Nobody");
        } else {
            doSomething(liriCmd, liriPara);
        }
        break;
    case 'do-what-it-says':
        getRandom().then(function(p1, p2) {
            return getCall(p1, p2);
        })
        break;
}

function doSomething(p1, p2) {

    switch (p1) {
        case 'my-tweets':
            var params = { screen_name: p2 };
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                if  (error)  {        
                    console.log('Error occurred: '  +  error);        
                    return;    
                }
                console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
                console.log('============*** 20 most recent Tweets for ' + params.screen_name + ' ***=============');
                console.log(' ');
                for (var i = 0; i < tweets.length; i++) {
                    console.log('--------Tweet #' + (i + 1) + ' - Sent ' + tweets[i].created_at + '--------');
                    console.log(tweets[i].text);
                    console.log(' ');
                }
                console.log('--------------------------------------------------------------------');
                console.log('|"my-tweets" accepts a parameter too!  Try a diffent twitter user. |');
                console.log('--------------------------------------------------------------------');
            });
            break;
        case 'spotify-this-song':
            spotify.search({ type: 'track', query: p2 },  function(error, data)  {    
                if  (error)  {        
                    console.log('Error occurred: '  +  error);        
                    return;    
                }
                console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
                console.log(' ');
                console.log('===*** Song Search for ' + p2 + ' ***===');
                console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name);
                console.log("Track Name: " + data.tracks.items[0].name);
                console.log("Preview URL: " + data.tracks.items[0].preview_url);
                console.log("Album Name: " + data.tracks.items[0].album.name);
                console.log('=================================================');
                console.log(' ');
            });
            break;
        case 'movie-this':
            var queryUrl = "https://www.omdbapi.com/?t=" + p2 + "&type=movie&tomatoes=true";
            request(queryUrl, function(error, response, body) {
                if  (error)  {        
                    console.log('Error occurred: '  +  error);        
                    return;    
                } 
                var movieObj = JSON.parse(body);
                console.log(' ');
                console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
                console.log('====*** Movie Search for ' + p2 + ' ***====');
                console.log("Title: " + movieObj.Title);
                console.log("Year Released: " + movieObj.Year);
                console.log("IMDB Rating: " + movieObj.imdbRating);
                console.log("Produced in: " + movieObj.Country);
                console.log("Language: " + movieObj.Language);
                console.log("Plot: " + movieObj.Plot);
                console.log("Actors: " + movieObj.Actors);
                console.log("Rotten Tomatoes Rating: " + movieObj.Ratings[1].Value);
                console.log("Rotten Tomatoes URL: " + movieObj.tomatoURL);
                console.log('==================================================');
                console.log(' ');

            });
            break;
    }

}
