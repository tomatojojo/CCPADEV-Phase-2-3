const SavedSong = require('../database/models/SavedSong');
const Song = require('../database/models/Song');

exports.saveSong = async (req,res) =>{
    var songName = req.query.songName;
    var artistName = req.query.artistName;
    const selectedSong = await Song.find({songName: songName, artistName: artistName}).lean();

    SavedSong.countDocuments({songName: songName, artistName: artistName, username: req.session.name}, function (err, count){
        if(count > 0){
            console.log(count);
        }
        else{
            SavedSong.create({
                username: req.session.name,
                songName: selectedSong[0].songName,
                artistName: selectedSong[0].artistName,
                songCover: selectedSong[0].songCover,
                songFile: selectedSong[0].songFile,
                owner: selectedSong[0].owner
            }, (error,post) => {
                    res.redirect('/');
            })
        }
    });
};

exports.deleteSavedSong =  async (req,res) =>{
    var songName = req.query.songName;
    var artistName = req.query.artistName;
    
    SavedSong.deleteOne({songName: songName, artistName: artistName, username: req.session.name}, (error, result) => {
        if(error) return false;
        console.log('Document deleted: ' + result.deletedCount);
        return true;
    });
};