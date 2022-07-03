$(document).ready(function() {
    //download a song from the search page
    $('#searchpage').on('click', '.btn', function (event) {
        var selectedDiv = $(this).parent().children('div');
        var songDetails = $(selectedDiv).children('div').eq(0);
        var track_name =  $(songDetails).children('h1').eq(0).text();
        var artist_name = $(songDetails).children('p').eq(0).text();

        console.log(artist_name)

        $.get('/save-song', {songName: track_name, artistName: artist_name}, function(result) {
        console.log(result);
        });
    });

    //like a song from the search page
    $('#searchpage').on('click', '.likeBtn', function (event) {
        var selectedDiv = $(this).parent().children('div');
        var songDetails = $(selectedDiv).children('div').eq(0);
        var track_name =  $(songDetails).children('h1').eq(0).text();
        var artist_name = $(songDetails).children('p').eq(0).text();

        $.get('/like-song', {songName: track_name, artistName: artist_name}, function(result) {
          console.log(result);
        });
      });


    //go to a artist page from the search page
    $('#artistSection').on('click', '.artistDiv', function (event) {
        var songDiv = $(this).children('div').eq(0);
        var songDetails = $(songDiv).children('div').eq(0);
        var artistName = $(songDetails).children('h1').eq(0).text();

        $.get('/get-artist-page', {artistName: artistName}, function(result) {
            console.log(result);
            $('body').html(result);
        });
    });
});