// include required node packages
var twitCred = require('./keys.js');
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var inquirer = require('inquirer');
var opn = require('opn');

var fs = require('fs');

// credentials for twitter call - pulled from keys.js
var client = new twitter({
    consumer_key: twitCred.twitterKeys.consumer_key,
    consumer_secret: twitCred.twitterKeys.consumer_secret,
    access_token_key: twitCred.twitterKeys.access_token_key,
    access_token_secret: twitCred.twitterKeys.access_token_secret
});

var getArtistNames = function(artist) {
    return artist.name;
}

// use inquirer to prompt user for needed information
var questions = [{
    type: "list",
    name: "sType",
    message: "Hi, I'm Liri. What can I help you find?",
    choices: ["Song Info", "Movie Info", "Twitter Feed", "Let me pick for you (from Random.txt)"]
}, {
    type: "input",
    name: "sName",
    message: "Search term? (movie, song or Twitter handle): "
}];

inquirer.prompt(questions).then(function(answers) {
    var liriCmd = answers.sType;
    var liriPara = answers.sName;

    // determine if user entered a parameter and if not define defaults then
    // call doSomething() with two needed parameters 

    switch (liriCmd) {
        case 'Twitter Feed':
            if (liriPara === '') {
                doSomething('my-tweets', 'dlphillips'); //default
            } else {
                doSomething('my-tweets', liriPara);
            }
            break;
        case 'Song Info':
            if (liriPara === '') {
                doSomething('spotify-this-song', "The Sign Ace of Base"); //default
            } else {
                doSomething('spotify-this-song', liriPara);
            }
            break;
        case 'Movie Info':
            if (liriPara === '') {
                doSomething('movie-this', "Mr. Nobody"); //default
            } else {
                doSomething('movie-this', liriPara);
            }
            break;
        case 'Let me pick for you (from Random.txt)':
            var data = fs.readFileSync("random.txt", "utf8").toString();
            var split = data.split(",");
            doSomething(split[0], split[1]);
            break;
    }
});

// function that finally does something

function doSomething(p1, p2) { // p1 is liri command, p2 is parameter (twitter user, song name, movie name)
    fs.appendFileSync('log.txt', '\r\nnode liri ' + p1 + ' ' + p2);
    switch (p1) {
        case 'my-tweets': // 'node liri my-tweets ...'
            var params = { screen_name: p2 };
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                if  (error)  {        
                    console.log('Error occurred: '  +  error);      
                    return;    
                }
                console.log('\r\n============*** 20 most recent Tweets for ' + params.screen_name + ' ***=============');
                fs.appendFileSync('log.txt', '\r\n============*** 20 most recent Tweets for ' + params.screen_name + ' ***=============');
                console.log(' ');
                fs.appendFileSync('log.txt', '\r\n ');
                for (var i = 0; i < tweets.length; i++) {
                    console.log('\r\n--------Tweet #' + (i + 1) + ' - Sent ' + tweets[i].created_at + '--------');
                    fs.appendFileSync('log.txt', '\r\n--------Tweet #' + (i + 1) + ' - Sent ' + tweets[i].created_at + '--------');
                    console.log(tweets[i].text);
                    fs.appendFileSync('log.txt', '\r\n' + tweets[i].text);
                    console.log('----------------------------------------------------------------------');
                    fs.appendFileSync('log.txt', '\r\n----------------------------------------------------------------------');
                    console.log(' ');
                    fs.appendFileSync('log.txt', '\r\n ');
                }
                console.log('\r\n================================================================');
                fs.appendFileSync('log.txt', '\r\n================================================================');

                var questions = [{
                    type: "confirm",
                    name: "opnUrl",
                    message: "Would you also like to open the Twitter feed for " + p2 + " in your browser?"
                }];

                inquirer.prompt(questions).then(function(answers) {
                    if (answers.opnUrl) {
                        opn('https://twitter.com/' + p2);
                    }
                });

            });
            break;
        case 'spotify-this-song': // 'node liri spotify-this-song ...'
            spotify.search({ type: 'track', query: p2 },  function(error, data)  {    
                if  (error)  {        
                    console.log('Error occurred: '  +  error);        
                    return;    
                }
                var songObj = data.tracks.items;
                for (var i = 0; i < songObj.length; i++) {
                    console.log(' ');
                    fs.appendFileSync('log.txt', '\r\n ');
                    console.log('========*** Song Search for ' + p2 + ' --- Result #' + (i + 1) + ' ***========');
                    fs.appendFileSync('log.txt', '\r\n========*** Song Search for ' + p2 + ' --- Result #' + (i + 1) + ' ***========');
                    console.log("Artist Name: " + songObj[i].artists.map(getArtistNames));
                    fs.appendFileSync('log.txt', "\r\nArtist Name: " + songObj[i].artists.map(getArtistNames));
                    console.log("Track Name: " + songObj[i].name);
                    fs.appendFileSync('log.txt', "\r\nTrack Name: " + songObj[i].name);
                    console.log("Preview URL: " + songObj[i].preview_url);
                    fs.appendFileSync('log.txt', "\r\nPreview URL: " + songObj[i].preview_url);
                    console.log("Album Name: " + songObj[i].album.name);
                    fs.appendFileSync('log.txt', "\r\nAlbum Name: " + songObj[i].album.name);
                    console.log('================================================================');
                    fs.appendFileSync('log.txt', '\r\n================================================================');
                    console.log(' ');
                    fs.appendFileSync('log.txt', '\r\n ');
                }

                var questions = [{
                    type: "confirm",
                    name: "opnUrl",
                    message: "Would like to listen to a preview of the first match above for '" + p2 + "'?"
                }];

                inquirer.prompt(questions).then(function(answers) {
                    if (answers.opnUrl) {
                        opn(songObj[0].preview_url);
                    }
                });

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
                fs.appendFileSync('log.txt', '\r\n ');
                console.log('====*** Movie Search for ' + p2 + ' ***====');
                fs.appendFileSync('log.txt', '\r\n====*** Movie Search for ' + p2 + ' ***====');
                console.log("Title: " + movieObj.Title);
                fs.appendFileSync('log.txt', "\r\nTitle: " + movieObj.Title);
                console.log("Year Released: " + movieObj.Year);
                fs.appendFileSync('log.txt', "\r\nYear Released: " + movieObj.Year);
                console.log("IMDB Rating: " + movieObj.imdbRating);
                fs.appendFileSync('log.txt', "\r\nIMDB Rating: " + movieObj.imdbRating);
                console.log("Produced in: " + movieObj.Country);
                fs.appendFileSync('log.txt', "\r\nProduced in: " + movieObj.Country);
                console.log("Language: " + movieObj.Language);
                fs.appendFileSync('log.txt', "\r\nLanguage: " + movieObj.Language);
                console.log("Plot: " + movieObj.Plot);
                fs.appendFileSync('log.txt', "\r\nPlot: " + movieObj.Plot);
                console.log("Actors: " + movieObj.Actors);
                fs.appendFileSync('log.txt', "\r\nActors: " + movieObj.Actors);
                console.log("Rotten Tomatoes Rating: " + movieObj.Ratings[1].Value);
                fs.appendFileSync('log.txt', "\r\nRotten Tomatoes Rating: " + movieObj.Ratings[1].Value);
                console.log("Rotten Tomatoes URL: " + movieObj.tomatoURL);
                fs.appendFileSync('log.txt', "\r\nRotten Tomatoes URL: " + movieObj.tomatoURL);
                console.log('==================================================');
                fs.appendFileSync('log.txt', '\r\n==================================================');
                console.log(' ');
                fs.appendFileSync('log.txt', '\r\n ');

                var questions = [{
                    type: "confirm",
                    name: "opnUrl",
                    message: "Would like to open the Rotten Tomatoes URL for '" + p2 + "' in your browser?"
                }];

                inquirer.prompt(questions).then(function(answers) {
                    if (answers.opnUrl) {
                        opn(movieObj.tomatoURL);
                    }
                });
            });
            break;
    }

}
