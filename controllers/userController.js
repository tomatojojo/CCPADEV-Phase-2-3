const User = require('../database/models/User');
const SavedSong = require('../database/models/SavedSong');
const Song = require('../database/models/Song');
const SongLikes = require('../database/models/SongLikes');
const bcrypt = require('bcryptjs');
const path = require('path');

//Register User
exports.registerUser = (req,res) => {
    const {fname, lname, username, email, password, cpassword} = req.body;

    User.getOne({username: username}, (err, result) => {
        if(result || cpassword != password){
            console.log(result);
            res.redirect('/signup');
        }
        else{
            const saltRounds = 10;

            bcrypt.hash(password, saltRounds, (err, hashed) => {
                const newUser = {
                    fname,
                    lname,
                    username,
                    email,
                    password: hashed,
                    profpic: '/profpics/default.png'
                };

                User.create(newUser, (err, user) => {
                   console.log(user);
                });
            });

            res.redirect('/login');
        }
    })
};

//Login User
exports.loginUser = (req,res) => {
    const {username, password} = req.body;

    User.getOne({ username: username }, (err, user) => {

        console.log(user);
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
               
                req.session.user = user._id;
                req.session.name = user.username;
            
                console.log(req.session);
            
                res.redirect('/');
                } 
                else {
                    
                    console.log('passwords do not match')
                }
            });
        } 
        else {
            console.log("no user exists in database");
          }
        
      });
      
};

//Logout User
exports.logoutUser = (req, res) => {
    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/');
      });
    }
  };

//renders page where user can edit their profile
exports.editProfile = (req,res) => {
    User.getOne({_id: req.session.user}, (err, user) => {
        res.render('edit-profile', {username: user.username, lname: user.lname, fname: user.fname, email: user.email, profpic: user.profpic});
    });
}

//View the users profile/settings
exports.viewProfile = (req,res) => {
    User.getOne({_id: req.session.user}, (err, user) => {
        res.render('settings', {lname: user.lname, fname: user.fname, username: user.username, email: user.email, profpic: user.profpic});
    });
}

//executes the edits users made
exports.editUser = (req,res) => {
    var {lname, fname, email, newpassword} = req.body;
    var newUsername = req.body.username;
    var currUsername = req.session.name;

    if(newpassword != req.body.confirmnewpassword){
        res.redirect('/edit-profile');
    }else{
        User.getOne({ _id: req.session.user }, (err, user) => {  
            if(newpassword != ""){
                const saltRounds = 10;
                bcrypt.hash(newpassword, saltRounds, (err, hashed) => {
                    var hashedpassword = hashed
                    User.updateOne({_id: req.session.user}, {password: hashedpassword}, function(err, result){
                    });
                });
            }
    
            if(currUsername != newUsername){
                User.getOne({ username: newUsername }, (err, user2) => { 
                    if(!user2){
                        Song.updateMany({artistName: user.username}, {artistName: newUsername}, function (err, result){
                        });
            
                        SavedSong.updateMany({artistName: user.username}, {artistName: newUsername}, function (err, result){
                        });
    
                        SavedSong.updateMany({username: user.username}, {username: newUsername}, function (err, result){
                        });
    
                        SongLikes.updateMany({likedBy: user.username}, {likedBy: newUsername}, function (err, result){
                        });
    
                        User.updateOne({_id: req.session.user}, {username: newUsername}, function(err, result){
                        });
                        
                        req.session.name = newUsername;
                        req.session.save();
                    }
                });
            }
             
            //if they uploaded a new dp
            if(req.files){
                var img = req.files;
    
                img.dp.mv(path.resolve(__dirname, '../public/profpics',img.dp.name))
    
                User.updateOne({_id: req.session.user}, {fname: fname, lname: lname, email: email, profpic: '/profpics/'+img.dp.name}, function(err, result){
                });
            }
    
            //if they didnt load a new dp
            else{
                User.updateOne({_id: req.session.user}, {fname: fname, lname: lname, email: email}, function(err, result){
                });
            }
            
        });
        res.redirect('settings');
    }
    
    
};

//view other users profile
exports.viewArtistPage = async (req,res) => {
    var username = req.query.artistName;
    const songs = await Song.find({artistName: username}).lean();


    User.get1({username: username }, (err, user) => {
        res.render('artist', {user, songs}, function(req, result){
            res.send(result);
        })
    });

    console.log(username)
}

//delete user account
exports.deleteAccount = async (req,res) => {
    var username = req.session.name;

    SavedSong.deleteMany({artistName: username}, (error, result) => {
        if(error) return false;
        console.log('Document deleted: ' + result.deletedCount);
    

        Song.deleteMany({artistName: username}, (error, result) => {
            if(error) return false;
            console.log('Document deleted: ' + result.deletedCount);
        });
        
        SongLikes.deleteMany({artistName: username}, (error, result) => {
            if(error) return false;
            console.log('Document deleted: ' + result.deletedCount);
        });

        SongLikes.deleteMany({likedBy: username}, (error, result) => {
            if(error) return false;
            console.log('Document deleted: ' + result.deletedCount);
        });

        this.logoutUser(req, res);

        User.deleteOne({username: username}, (err, user) => {
        })
    });
}