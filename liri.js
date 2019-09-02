require("dotenv").config();
var fs = require('fs');
var inquire = require('inquirer')

var keys = require("./keys.js");

// var spotify = new Spotify(keys.spotify);
var request = require('request');
var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});



var getArtistNames = function (artist) {
    return artist.name;
}

var getMeSpotify = function (songName) {
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // console.log(data);
        var songs = data.tracks.items;
        for (var i = 0; i < songs.length; i++) {
            console.log(i);
            console.log('artist(s): ' + songs[i].artists.map(getArtistNames));
            console.log('song name: ' + songs[i].name);
            console.log('preview song: ' + songs[i].preview_url);
            console.log('album: ' + songs[i].album.name);
            console.log('--------------------------------------------------');
        }
        setTimeout(cont, 2000)
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
            setTimeout(cont, 2000)
        }
    })
}

var runBandsInTown = function(artist) {
    request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`, function(error, response, body){
        if (!error && response.statusCode == 200){
            console.log(JSON.parse(body));
            setTimeout(cont, 2000)
        }else{
            console.log('error', error);
        }
    })
}

var doRandom = function() {

fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) throw err;

    var dataArr = data.split(';');
    var rdn = dataArr[Math.floor(Math.random()*dataArr.length)]
    var dataQuery = rdn.split(',')
    if (dataQuery.length == 2) {
        pick(dataQuery[0], dataQuery[1]);
    } else if (dataQuery.length ==1) {
        pick(dataQuery[0]);
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
            break;
        case 'do-what-it-says':
            doRandom();
            break;
        case 'concert-this':
            runBandsInTown(functionData);
            break;
        default:
            console.log('LIRI does not know that');
    }
}

initialize =()=>{
    inquire
    .prompt({
        type: "list",
        message: "What do you want to know?",
        name:"option",
        choices: ["spotify-this-song", "movie-this", "do-what-it-says", "concert-this"]
    }
    ).then(answer=>{
        if (answer.option == "do-what-it-says"){
            pick(answer.option)
        }else{
            inquire
            .prompt(
                {
                    type: "input",
                    message: "Please input your search term.",
                    name: "term"
                }
            ).then(reply =>{
                pick(answer.option,reply.term)
            })
        }
    })
}

cont =()=>{
    inquire
    .prompt({
        type: "list",
        message: "What would you like to do now?",
        name: "option",
        choices: ["Use another function", "quit LIRI"]
    }).then(res=>{
        if(res.option == "quit LIRI"){
            process.exit();
        }else{
            initialize()
        }
    })
}

initialize()