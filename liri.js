require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var request = require('request');


var getArtistNames = function(artist) {
    return artist.name;
}

var getMeSpotify = function(songName) {

    spotify.search({ type: 'track', query: songName}, function(err, data) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }

        var songs = data.tracks.items;
        for (var i=0; i<songs.length; i++) {
            console.log(i);
            console.log('artist(s): ' + songs[i].artists.map(getArtistNames));
            console.log('song name: ' + songs[i].name);
            console.log('preview song: ' + songs[i].preview_url);
            console.log('album: ' + songs[i].album.name);
            console.log('--------------------------------------------------');
        }
     
    });
}

var getMeMovie = function(movieName) {

        request('http://www.omdbapi.com/apikey=Trilogy?t=' + movieName + '&y=&plot=short&r=json', function (error, response, body) {
            if (!error && response.statusCode == 200) {
        console.log('error:', error); // Print the error if one occurred
        console.log('body:', body); // Print the HTML for the Google homepage.
        }
    })
}


var pick = function(caseData, functionData) {
    switch(caseData) {
        case 'spotify-this-song':
            getMeSpotify(functionData);
            break;
        case 'movie-this':
            getMeMovie(functionData);
        default:
        console.log('LIRI does not know that');
    }
}


var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);