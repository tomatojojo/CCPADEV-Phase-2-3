const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    songName: String,
    artistName: String,
    songCover: String,
    songFile: String,
    numLikes: Number
});

const Song = mongoose.model('Song', SongSchema);

module.exports = Song;