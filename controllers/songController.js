const Song = require('../database/models/Song');
const SavedSong = require('../database/models/SavedSong');
const SongLikes = require('../database/models/SongLikes');
const User = require('../database/models/User');
const path = require('path');

//Uploading a Song
exports.uploadSong =  (req,res) => {
    const song = req.files

    //checks if file is correct type
    const extensionName1 = path.extname(song.songFile.name)
    const allowedExtension1 = ['.mp3']
    const extensionName2 = path.extname(song.songCover.name)
    const allowedExtension2 = ['.jpg', '.png']

    if(!allowedExtension1.includes(extensionName1)){
        res.redirect('library')
    }
    else if(!allowedExtension2.includes(extensionName2)){
        res.redirect('library')
    }
    else{
       Song.countDocuments({songName: req.body.songName, artistName: req.session.name}, function (err, count){
            if(count > 0){
                console.log(count);
                res.redirect('/library');
            }
            else{
                console.log(count);
                //moves songcover to the public file
                song.songCover.mv(path.resolve(__dirname, '../public/songs', song.songCover.name), (error) => {
                    if (error) {
                        console.log(error)
                        res.redirect('/error')
                    }
                })

                //moves songfile to the public folder and creates the entry to the databases
                song.songFile.mv(path.resolve(__dirname, '../public/songs',song.songFile.name),(error) => {
                    Song.create({
                        ...req.body,
                        artistName: req.session.name,
                        numLikes: 0,
                        songFile:'/songs/'+song.songFile.name,
                        songCover: '/songs/'+song.songCover.name
                    }, (error,post) => {
                            res.redirect('/')
                    })
                })
            }
        });
    }   
};

//Deleteing a song User owns
exports.deleteOwnedSong = async (req,res) =>{
    var songName = req.query.songName;
    var artistName = req.query.artistName;
    
    SavedSong.deleteMany({songName: songName, artistName: artistName}, (error, result) => {
        if(error) return false;
        console.log('Document deleted: ' + result.deletedCount);
    

        Song.deleteMany({songName: songName, artistName: artistName}, (error, result) => {
            if(error) return false;
            console.log('Document deleted: ' + result.deletedCount);
            return true;
        });
    });
};

//editing a Song User owns
exports.editSong = async (req,res) =>{
    var selectedSong = req.body.selectedSong;
    var newSongName = req.body.songName;
    var artistName = req.session.name;

    if(newSongName == "")
        newSongName = selectedSong

    
    Song.countDocuments({songName: selectedSong, artistName: artistName}, function (err, count){
        if(count > 0){
            if(selectedSong != newSongName){
                Song.countDocuments({songName: newSongName, artistName: artistName}, function (err, count){
                    if(count == 0){
                        Song.updateOne({songName: selectedSong, artistName: artistName}, {songName: newSongName}, function(err, result){
                        });
                        SavedSong.updateMany({songName: selectedSong, artistName: artistName}, {songName: newSongName}, function(err, result){
                        });
                        SongLikes.updateMany({songName: selectedSong, artistName: artistName}, {songName: newSongName}, function(err, result){
                        });
                    }
                });
            }
            else{
                Song.updateOne({songName: selectedSong, artistName: artistName}, {songName: newSongName}, function(err, result){
                });
                SavedSong.updateMany({songName: selectedSong, artistName: artistName}, {songName: newSongName}, function(err, result){
                });
            }
            
            if(req.files){
                var songCover = req.files.songCover;
                console.log(songCover.name)
                songCover.mv(path.resolve(__dirname, '../public/songs', songCover.name), (error) => {
                    if (error)
                        res.redirect('/error')
                })

                Song.updateOne({songName: newSongName, artistName: artistName}, {songCover: '/songs/'+songCover.name}, function(err, result){
                });
                SavedSong.updateMany({songName: newSongName, artistName: artistName}, {songCover: '/songs/'+songCover.name}, function(err, result){
                });
            }
        }

        res.redirect('library');
    });
};


//Displaying songs that match search criteria
exports.displaySearch = async (req,res) =>{
    var criteria = req.body.search;

    const songList = await Song.find({$or: [{songName: {$regex: criteria,  $options: "i"}}, {artistName: {$regex: criteria,  $options: "i"}}]}).lean();
    User.findMany({username: {$regex: criteria,  $options: "i"}}, function(err, result){
        res.render('searchPage', {songList, criteria, result});
    });
    
};

//Liking a song
exports.likeSong = async (req,res) =>{
    var username = req.session.name;
    var songName = req.query.songName;
    var artistName = req.query.artistName;
    var selectedSong = await Song.findOne({songName: songName, artistName: artistName}).lean().select('numLikes');
    var numLikes = selectedSong.numLikes;

    SongLikes.countDocuments({songName: songName, artistName: artistName, likedBy: username}, function (err, count){
        if(count == 0){
            SongLikes.create({songName: songName, artistName: artistName, likedBy: username}, (err, result) =>{
            })
            numLikes = numLikes + 1;
        }
        else{
            SongLikes.deleteOne({songName: songName, artistName: artistName, likedBy: username}, (err, result) =>{
            })
            numLikes = numLikes - 1;
        }

        Song.updateOne({songName: songName, artistName: artistName}, {numLikes: numLikes}, function (err, count){
        })
    })
    
};
