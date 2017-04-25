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

var req = [];

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


// if (liriCmd === 'do-what-it-says') {
//     getRandom().then(function(p1, p2) {
//         return getCall(p1, p2);
//     })
// } else {
//     doSomething(liriCmd, liriPara);
// }


switch (liriCmd) {
    case 'my-tweets':
        doSomething(liriCmd);
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
            var params = { screen_name: 'dlphillips' };
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                if  (error)  {        
                    console.log('Error occurred: '  +  error);        
                    return;    
                } 
                console.log('======================');
                for (var i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].text);
                    console.log(tweets[i].created_at);
                }
                console.log('======================');
            });
            break;
        case 'spotify-this-song':
            spotify.search({ type: 'track', query: p2 },  function(error, data)  {    
                if  (error)  {        
                    console.log('Error occurred: '  +  error);        
                    return;    
                } 
                console.log('======================');
                console.log(data.tracks.items[0].album.artists[0].name);
                console.log(data.tracks.items[0].name);
                console.log(data.tracks.items[0].preview_url);
                console.log(data.tracks.items[0].album.name);
                console.log('======================');
            });
            break;
        case 'movie-this':
            var queryUrl = "http://www.omdbapi.com/?t=" + p2 + "&y=&plot=short&r=json";
            request(queryUrl, function(error, response, body) {
                if  (error)  {        
                    console.log('Error occurred: '  +  error);        
                    return;    
                } 
                var rtUrl = "https://www.rottentomatoes.com/m/"+p2.split(' ').join('_')+"/";
                var rYear = JSON.parse(body).Released;
                console.log('======================');
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Year Released: " + rYear.slice(-4));
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Produced in: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Rotten Tomatoes URL: "+ rtUrl);
                console.log('======================');
            });
            break;
    }

}
