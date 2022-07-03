const mongoose = require('mongoose');

const SongLikesSchema = new mongoose.Schema({
    songName: String,
    artistName: String,
    likedBy: String
});

const SongLikes = mongoose.model('SongLikes', SongLikesSchema);

module.exports = SongLikes;
