// include required node packages
var twitCred = require('./keys.js');
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

// credentials for twitter call - pulled from keys.js
var client = new twitter({
    consumer_key: twitCred.twitterKeys.consumer_key,
    consumer_secret: twitCred.twitterKeys.consumer_secret,
    access_token_key: twitCred.twitterKeys.access_token_key,
    access_token_secret: twitCred.twitterKeys.access_token_secret
});

// get command and parameter from user
var liriCmd = process.argv[2];
var liriPara = process.argv[3];

var getArtistNames = function(artist) {
	return artist.name;
}

// get command from random.txt
var getRandom = function() {
    return new Promise(function(resolve, reject) {
        fs.readFile('random.txt', 'utf8', function(error, data) {
            liriCmd = data.split(",")[0];
            liriPara = data.split(",")[1];
            resolve('file read');
        });
    });
};

// this function is called when getRandom() is complete
var getCall = function(message) {
    return new Promise(function(resolve, reject) {
        doSomething(liriCmd, liriPara);
        resolve(message + ' , var assigned');
    });
};


// determine id user entered a parameter and if not define defaults. 
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
            return getCall(p1, p2); // call getRandom() and wait for promise to be fulfilled before calling getCall() to determine command & parameter
        })
        break;
}

// function that finally does something

function doSomething(p1, p2) { // p1 is liri command, p2 is parameter (twitter user, song name, movie name)

    switch (p1) {
        case 'my-tweets': // 'node liri my-tweets ...'
            var params = { screen_name: p2 };
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                if  (error)  {        
                    console.log('Error occurred: '  +  error);        
                    return;    
                }
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
        case 'spotify-this-song': // 'node liri spotify-this-song ...'
            spotify.search({ type: 'track', query: p2 },  function(error, data)  {    
                if  (error)  {        
                    console.log('Error occurred: '  +  error);        
                    return;    
                }
                var songObj = data.tracks.items;
                // use map() on artists here
                for (var i = 0; i < songObj.length; i++) {
                    console.log(' ');
                    console.log('========*** Song Search for ' + p2 + ' --- Result #' + (i + 1) + ' ***========');
                    console.log("Artist Name: " + songObj[i].artists.map(getArtistNames));
                    // console.log("Artist Name: " + songObj[i].album.artists[0].name);
                    console.log("Track Name: " + songObj[i].name);
                    console.log("Preview URL: " + songObj[i].preview_url);
                    console.log("Album Name: " + songObj[i].album.name);
                    console.log('================================================================');
                    console.log(' ');
                }
            });
            break;
        case 'movie-this': // 'node liri movie-this ... ''
            var queryUrl = "https://www.omdbapi.com/?t=" + p2 + "&type=movie&tomatoes=true";
            request(queryUrl, function(error, response, body) {
                if  (error)  {        
                    console.log('Error occurred: '  +  error);        
                    return;    
                } 
                var movieObj = JSON.parse(body);
                console.log(' ');
                console.log('==================================================');
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
