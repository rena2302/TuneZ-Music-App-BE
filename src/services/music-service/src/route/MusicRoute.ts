import express from 'express';
import MusicController from "../controller/MusicController.js";
import {authMiddleware} from "../util/middleware/AuthMiddleware.js";

const router = express.Router();

//CURD
router.post('/createNewMusic', MusicController.createMusicApi);
router.post('/uploadMusicByUser', authMiddleware, MusicController.uploadMusicByUserApi);
router.put('/updateMusic/:musicId', MusicController.updateMusicApi);
router.delete('/deleteMusic/:musicId', MusicController.deleteMusicApi);

//GET REQUEST
router.get('/getAllMusic', MusicController.getAllMusicsApi);
router.get('/getMusicByArtist', MusicController.getMusicByArtistApi);
router.get('/getMusicByGenres', MusicController.getMusicByGenresApi);
router.get('/getMusicHistory', authMiddleware, MusicController.getMusicHistoryApi);
router.get('/getMusicLove', authMiddleware, MusicController.getMusicLoveApi);
router.get('/getUserMusic', authMiddleware, MusicController.getUserMusicApi);

//STREAM
router.get('/getStreamMusic/:musicId', authMiddleware, MusicController.getStreamMusicApi);
router.get('/getMusicInfo/:musicId', authMiddleware, MusicController.getMusicInfoApi);
router.post('/pauseMusic', authMiddleware, MusicController.pauseMusicApi);
router.post('/playMusic/:musicId', authMiddleware, MusicController.playMusicApi);
router.post('/seekMusic/:musicId', authMiddleware, MusicController.seekMusicApi);
router.get('/getUserMusicState', authMiddleware, MusicController.getUserMusicStateApi);

//MICROSERVICE
router.post('/incrementLoveCount/:musicId', MusicController.incrementLoveCountApi);

//GENRES
router.post('/createGenre', MusicController.createGenreApi);
router.get('/getAllGenres', MusicController.getAllGenresApi);
router.get('/getGenreById/:genreId', MusicController.getGenreByIdApi);
router.put('/updateGenre/:genreId', MusicController.updateGenreApi);
router.delete('/deleteGenre/:genreId', MusicController.deleteGenreApi);

export default router;