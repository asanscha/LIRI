require("dotenv").config();
var fs = require('fs');

var keys = require("./keys.js");

// var spotify = new Spotify(keys.spotify);
var spotify = require('spotify');
var request = require('request');



var getArtistNames = function (artist) {
    return artist.name;
}

var getMeSpotify = function (songName) {

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data);
        var songs = data.tracks.items;
        for (var i = 0; i < songs.length; i++) {
            console.log(i);
            console.log('artist(s): ' + songs[i].artists.map(getArtistNames));
            console.log('song name: ' + songs[i].name);
            console.log('preview song: ' + songs[i].preview_url);
            console.log('album: ' + songs[i].album.name);
            console.log('--------------------------------------------------');
        }

    });
}

var getMeMovie = function (movieName) {

    request('http://www.omdbapi.com/?apikey=896476c8&t=' + movieName + '&y=&plot=short&r=json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('error:', error); // Print the error if one occurred
            
            var jsonData = JSON.parse(body);

            console.log('Title: ' + jsonData.Title);
            console.log('Year: ' + jsonData.Year);
            console.log('Rated: ' + jsonData.Rated);
            console.log('IMDB Rating: ' + jsonData.imdbRating);
            console.log('Country: ' + jsonData.Country);
            console.log('Language: ' + jsonData.Language);
            console.log('Plot: ' + jsonData.Plot)
            console.log('Actors: ' + jsonData.Actors)
            console.log('Rotten Tomatoes Rating: ' + jsonData.tomatoRating);
            console.log('Rotten Tomatoes URL: ' + jsonData.tomatoURL);
        }
    })
}

var doRandom = function() {

fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) throw err;

    var dataArr = data.split(',');
    if (dataArr.length == 2) {
        pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length ==1) {
        pick(dataArr[0]);
    }

  });
}

var pick = function (caseData, functionData) {
    switch (caseData) {
        case 'spotify-this-song':
            getMeSpotify(functionData);
            break;
        case 'movie-this':
            getMeMovie(functionData);
        case 'do-what-it-says':
            doRandom();
            break;
        default:
            console.log('LIRI does not know that');
    }
}


var runThis = function (argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);