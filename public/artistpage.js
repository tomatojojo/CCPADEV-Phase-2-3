$(document).ready(function() {
    $('.libraryDiv').on('click', '.btn', function (event) {
        var selectedDiv = $(this).parent().children('div');

        var songDetails = $(selectedDiv).children('div').eq(0);

        var track_name =  $(songDetails).children('h1').eq(0).text();
        var artist_name = $(songDetails).children('p').eq(0).text();

        $.get('/save-song', {songName: track_name, artistName: artist_name}, function(result) {
            console.log(result);
        });
    });

    $('.libraryDiv').on('click', '.likeBtn', function (event) {
        var selectedDiv = $(this).parent().children('div');
        var songDetails = $(selectedDiv).children('div').eq(0);
        var track_name =  $(songDetails).children('h1').eq(0).text();
        var artist_name = $(songDetails).children('p').eq(0).text();

        $.get('/like-song', {songName: track_name, artistName: artist_name}, function(result) {
          console.log(result);
        });
    });
});

