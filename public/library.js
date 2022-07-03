function openTab(evt, tabName) {
  var i, tablinks;

  libraryDiv = document.getElementsByClassName("libraryDiv");
  for (i = 0; i < libraryDiv.length; i++) {
    libraryDiv[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

$(document).ready(function() {
  //Saving a song from browse section
  $('#browse').on('click', '.btn', function (event) {
    var selectedDiv = $(this).parent().children('div');
    var songDetails = $(selectedDiv).children('div').eq(0);
    var track_name =  $(songDetails).children('h1').eq(0).text();
    var artist_name = $(songDetails).children('p').eq(0).text();

    $.get('/save-song', {songName: track_name, artistName: artist_name}, function(result) {
      console.log(result);
    });
  });

  //liking a song from browse section
  $('#browse').on('click', '.likeBtn', function (event) {
    var selectedDiv = $(this).parent().children('div');
    var songDetails = $(selectedDiv).children('div').eq(0);
    var track_name =  $(songDetails).children('h1').eq(0).text();
    var artist_name = $(songDetails).children('p').eq(0).text();

    $.get('/like-song', {songName: track_name, artistName: artist_name}, function(result) {
      console.log(result);
    });
  });

    //Saving a song from trending section
  $('#trending').on('click', '.btn', function (event) {
    var selectedDiv = $(this).parent().children('div');
    var songDetails = $(selectedDiv).children('div').eq(0);
    var track_name =  $(songDetails).children('h1').eq(0).text();
    var artist_name = $(songDetails).children('p').eq(0).text();

    $.get('/save-song', {songName: track_name, artistName: artist_name}, function(result) {
      console.log(result);
    });
  });

    //liking a song from trending section
    $('#trending').on('click', '.likeBtn', function (event) {
      var selectedDiv = $(this).parent().children('div');
      var songDetails = $(selectedDiv).children('div').eq(0);
      var track_name =  $(songDetails).children('h1').eq(0).text();
      var artist_name = $(songDetails).children('p').eq(0).text();

      $.get('/like-song', {songName: track_name, artistName: artist_name}, function(result) {
        console.log(result);
      });
    });

  //deleting a song from saved section
  $('#saved').on('click', '.leftBtn', function (event) {
    var selectedDiv = $(this).parent().children('div');
    var songDetails = $(selectedDiv).children('div').eq(0);
    var track_name =  $(songDetails).children('h1').eq(0).text();
    var artist_name = $(songDetails).children('p').eq(0).text();

    $.get('/delete-saved-song', {songName: track_name, artistName: artist_name}, function(result) {
      console.log(result);
    });

    $(this).parent().remove();
  });

  //deleting a song user owns
  $('#owned').on('click', '.leftBtn', function (event) {
    var selectedDiv = $(this).parent().children('div');
    var songDetails = $(selectedDiv).children('div').eq(0);
    var track_name =  $(songDetails).children('h1').eq(0).text();
    var artist_name = $(songDetails).children('p').eq(0).text();

    $.get('/delete-owned-song', {songName: track_name, artistName: artist_name}, function(result) {
      console.log(result);
    });

    $(this).parent().remove();
  });

});
