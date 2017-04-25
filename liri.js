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


if (liriCmd === 'do-what-it-says') {

    getRandom().then(function(p1, p2) {
        return getCall(p1, p2);
    })

    // getRandom().then(function(p1, p2) {
    //     return getCall(p1, p2);
    // }).then(function(p1, p2) {
    //     return doSomething(p1, p2);
    // }).then(function(result) {
    //     console.log('finished');
    // })

} else {

    doSomething(liriCmd, liriPara);

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
                console.log('======================');
                console.log(JSON.parse(body).Title);
                console.log(JSON.parse(body).Year);
                console.log(JSON.parse(body).imdbRating);
                console.log(JSON.parse(body).Country);
                console.log(JSON.parse(body).Language);
                console.log(JSON.parse(body).Plot);
                console.log(JSON.parse(body).Actors);
                console.log(JSON.parse(body).Ratings[1].Source);
                console.log(JSON.parse(body).Ratings[1].Value);
                console.log('======================');
            });
            break;
    }

}
