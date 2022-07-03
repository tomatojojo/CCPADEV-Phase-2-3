const mongoose = require('mongoose');

const SavedSongSchema = new mongoose.Schema({
    username: String,
    songName: String,
    artistName: String,
    songCover: String,
    songFile: String
});

const SavedSong = mongoose.model('SavedSong', SavedSongSchema);

module.exports = SavedSong;
