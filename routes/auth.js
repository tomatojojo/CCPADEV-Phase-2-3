const router = require('express').Router();
const userController = require('../controllers/userController');
const songController = require('../controllers/songController');
const savedSongController = require('../controllers/savedSongController');
const {isPublic, isPrivate} = require('../middlewares/checkAuth');

//main page
router.get('/', function(req, res){ 
  res.render('index');
});

//edit song page
router.get('/editSongs', isPrivate, function(req, res){ 
  res.render('editSongs');
});

//cover page
router.get('/about', function(req, res){
  res.render('about');
});

//login page
router.get('/login', isPublic, (req, res) => {
  res.render('login');
});

//for logging out
router.get('/logout', isPrivate, userController.logoutUser);

//sign up page
router.get('/signup', isPublic, (req, res) => {
  res.render('signUp');
});

//for registering user
router.post('/register', isPublic, userController.registerUser);
router.post('/submit-login', isPublic, userController.loginUser);

//upload page
router.get('/upload', isPrivate, (req, res) => {
    res.render('upload');
});

//upload a song
router.post('/upload-song', isPrivate, songController.uploadSong);

//delete a song user owns
router.get('/delete-owned-song', isPrivate, songController.deleteOwnedSong);

//like a song
router.get('/like-song', isPrivate, songController.likeSong);

//save a song
router.get('/save-song', isPrivate, savedSongController.saveSong);

//delete a song user saved
router.get('/delete-saved-song', isPrivate, savedSongController.deleteSavedSong);

//edit a song user owns
router.post('/submit-edit-song', isPrivate, songController.editSong);

//settings page
router.get('/settings', isPrivate, userController.viewProfile);

//edit user profile
router.get('/edit-profile', isPrivate, userController.editProfile);

//delete user profile
router.get('/delete-account', isPrivate, userController.deleteAccount);

//submit edits of a profile
router.post('/submit-edit-profile', isPrivate, userController.editUser);

//for searching
router.post('/submit-search', songController.displaySearch);

//displaying artist page
router.get('/get-artist-page', userController.viewArtistPage);


module.exports = router;