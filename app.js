var PORT = process.env.PORT || 3000;

const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const {isPublic, isPrivate} = require('./middlewares/checkAuth');

const authRouter = require('./routes/auth');

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/jjjsongs',
{useNewURLParser: true, useUnifiedTopology: true});

var app = new express();

app.use(express.static(__dirname + '/public'));

const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: 'somegibbersihsecret',
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017'
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 * 3}
}))

app.use(flash());

app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({extname: 'hbs'}));

const fileUpload = require("express-fileupload");

const Song = require('./database/models/Song');

app.use(express.json());
app.use(express.urlencoded( {extended: true} ));
app.use(fileUpload());

const SavedSong = require('./database/models/SavedSong');

app.get('/delete-saved-song', async (req,res) =>{
    var songName = req.query.songName;
    var artistName = req.query.artistName;
    
    SavedSong.deleteOne({songName: songName, artistName: artistName, username: req.session.name}, (error, result) => {
        if(error) return false;
        console.log('Document deleted: ' + result.deletedCount);
        return true;
    });
});

app.get('/library', async(req,res) => {
    const songs = await Song.find({}).lean();
    const ownSongs = await Song.find({artistName: req.session.name}).lean();
    const savedSongs = await SavedSong.find({username: req.session.name}).lean();

    const trending = await Song.find({}).sort({numLikes: 'desc'}).limit(10).lean();
    
    res.render('library',{songs, ownSongs, savedSongs});
});

var server = app.listen(PORT, function(){
    console.log("Node server is running at port 3000...");
});

app.use('/', authRouter);