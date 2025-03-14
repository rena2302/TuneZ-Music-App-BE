import multer from 'multer'
import {Request, Response} from "express";
import {MusicBaseService} from "../service/music_base/MusicBaseService.js";
import {IMusicFile} from "../interface/object/IMusicFile.js";
import {CreateMusicDto} from "../dto/request/CreateMusicDto.js";
import {IMusic} from "../interface/object/IMusic.js";
import {SongType} from "../enum/SongType.js";
import {UploadMusicDto} from "../dto/request/UploadMusicDto.js";
import {MusicUserService} from "../service/music_user/MusicUserService.js";
import {IAuthRequest} from "../interface/object/IAuthRequest.js";
import {MusicStreamService} from "../service/music_stream/MusicStreamService.js";
import {musicStreamRepository} from "../config/container/Container.js";


const uploadMulter = multer({
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            console.log("File is not a valid music or image file");
        }
    }
});
class MusicController {
    createMusicApi = [
        uploadMulter.fields([
            { name: "musicFile", maxCount: 1 },
            { name: "imgFile", maxCount: 1 }
        ]),
        async (req: Request, res: Response) => {
            try {
                const { name, artist, duration, genres, officialArtistId } = req.body;

                const musicData: IMusic = {
                    name,
                    songType: SongType.OFFICIAL,
                    artist,
                    duration: Number(duration),
                    genres: genres,
                    officialArtistId
                };

                const createMusicDto = new CreateMusicDto(musicData);
                await createMusicDto.validate();

                const files = req.files as { [fieldname: string]: Express.Multer.File[] };

                const musicFile = files.musicFile?.[0];
                const imgFile = files.imgFile?.[0];

                if (!musicFile) {
                    res.status(400).json({ message: "No music file uploaded" });
                    return;
                }

                if (!imgFile) {
                    res.status(400).json({ message: "No image file uploaded" });
                    return;
                }

                const musicObject: IMusicFile = {
                    originalName: musicFile.originalname,
                    mimetype: musicFile.mimetype,
                    buffer: musicFile.buffer,
                }

                const imgObject: IMusicFile = {
                    originalName: imgFile.originalname,
                    mimetype: imgFile.mimetype,
                    buffer: imgFile.buffer,
                }

                const newMusic = await MusicBaseService.createMusic.execute(musicData, musicObject, imgObject);

                res.status(201).json({
                    status: 201,
                    success: true,
                    message: 'Create new music successfully',
                    music: newMusic,
                });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error('Error creating new music:', error.message);
                    res.status(500).json({
                        status: 500,
                        success: false,
                        message: error.message,
                    });
                } else {
                    console.error('Unexpected error while creating music');
                    res.status(500).json({
                        status: 500,
                        success: false,
                        message: 'Unexpected error occurred',
                    });
                }
            }
        },
    ];

    uploadMusicByUserApi = [
        uploadMulter.fields([
            { name: "musicFile", maxCount: 1 },
            { name: "imgFile", maxCount: 1 }
        ]),
        async (req: IAuthRequest, res: Response) => {
            try {
                const userId = req.userId;

                if (!userId) {
                    res.status(401).send("Unauthorized");
                    return;
                }
                const { name, artist, duration, genres } = req.body;

                const musicData: IMusic = {
                    name,
                    songType: SongType.USER_GENERATED,
                    artist,
                    duration: Number(duration),
                    genres: genres,
                    userId
                };

                const uploadMusicDto = new UploadMusicDto(musicData);
                await uploadMusicDto.validate();

                const files = req.files as { [fieldname: string]: Express.Multer.File[] };

                const musicFile = files.musicFile?.[0];
                const imgFile = files.imgFile?.[0];

                if (!musicFile) {
                    res.status(400).json({ message: "No music file uploaded" });
                    return;
                }

                if (!imgFile) {
                    res.status(400).json({ message: "No image file uploaded" });
                    return;
                }

                const musicObject: IMusicFile = {
                    originalName: musicFile.originalname,
                    mimetype: musicFile.mimetype,
                    buffer: musicFile.buffer,
                }

                const imgObject: IMusicFile = {
                    originalName: imgFile.originalname,
                    mimetype: imgFile.mimetype,
                    buffer: imgFile.buffer,
                }

                const newMusic = await MusicUserService.uploadMusicByUser.execute(musicData, musicObject, imgObject);

                res.status(201).json({
                    status: 201,
                    success: true,
                    message: 'User uploaded music successfully',
                    music: newMusic,
                });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error('Error uploading user music:', error.message);
                    res.status(500).json({
                        status: 500,
                        success: false,
                        message: error.message,
                    });
                } else {
                    console.error('Unexpected error while uploading user music');
                    res.status(500).json({
                        status: 500,
                        success: false,
                        message: 'Unexpected error occurred',
                    });
                }
            }
        },
    ];

    getAllMusicsApi = async (_req: Request, res: Response) => {
        try {
            const musics = await MusicBaseService.getAllMusic.execute();

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Fetched all music successfully',
                data: musics,
            });
        } catch (error: unknown) {
            console.error('Error fetching all musics:', error);
            res.status(500).json({
                status: 500,
                success: false,
                message: 'Internal Server Error',
            });
        }
    };

    getMusicByArtistApi = async (req: Request, res: Response) => {
        try {
            const artist  = req.query.artist as string;

            if (!artist) {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Artist is required',
                });
                return;
            }

            const musicsByArtist = await MusicBaseService.getMusicByArtist.execute(artist);

            if (musicsByArtist?.length === 0) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: `No music found for artist: ${artist}`,
                });
                return;
            }

            res.status(200).json({
                status: 200,
                success: true,
                message: `Fetched music by artist: ${artist}`,
                data: musicsByArtist,
            });
        } catch (error: unknown) {
            console.error('Error fetching music by artist:', error);
            res.status(500).json({
                status: 500,
                success: false,
                message: 'Internal Server Error',
            });
        }
    };

    getMusicByGenresApi = async (req: Request, res: Response) => {
        try {
            const genres  = req.query.genres as string;

            if (!genres) {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Genres is required',
                });
                return;
            }

            const musicsByGenres = await MusicBaseService.getMusicByCategory.execute(genres);

            if (musicsByGenres?.length === 0) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: `No music found for Genres: ${genres}`,
                });
                return;
            }

            res.status(200).json({
                status: 200,
                success: true,
                message: `Fetched music by Genres: ${genres}`,
                data: musicsByGenres,
            });
        } catch (error: unknown) {
            console.error('Error fetching music by Genres:', error);
            res.status(500).json({
                status: 500,
                success: false,
                message: 'Internal Server Error',
            });
        }
    };

    getMusicHistoryApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }
            const musicHistory = await MusicUserService.getMusicHistory.execute(userId);

            if(musicHistory?.length === 0) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: `No music found with: ${userId}`,
                });
                return;
            }

            res.status(200).json({
                status: 200,
                success: true,
                message: `Fetched music history with: ${userId}`,
                data: musicHistory,
            });
        }catch (error: unknown) {
            console.error('Error fetching music history:', error);
            res.status(500).json({
                status: 500,
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    getMusicLoveApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }

            const musicLove = await MusicUserService.getMusicLove.execute(userId);

            if(musicLove?.length === 0) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: `No music found with: ${userId}`,
                });
                return;
            }

            res.status(200).json({
                status: 200,
                success: true,
                message: `Fetched music love with: ${userId}`,
                data: musicLove,
            });
        }catch (error: unknown) {
            console.error('Error fetching music love:', error);
            res.status(500).json({
                status: 500,
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    getStreamMusicApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }

            const musicId = req.params.musicId;

            const musicStream = await MusicStreamService.getStreamMusic.execute(userId, musicId);

            res.setHeader("Content-Type", "audio/mpeg");

            musicStream.pipe(res);

        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`,
            });
        }
    }

    playMusicApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            const musicId = req.params.musicId;
            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }
            const previousState = await MusicStreamService.getUserMusicState.execute(userId);
            let startFrom = 0;

            if (previousState.currentMusicId === musicId && !previousState.isPlaying) {
                startFrom = previousState.timestamp;
            }

            await MusicStreamService.updateUserMusicState.execute(userId, musicId, startFrom, true);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Music playing',
            })
        }catch (error){
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`,
            })
        }
    }

    pauseMusicApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }

            const state = await MusicStreamService.getUserMusicState.execute(userId);

            if(!state.currentMusicId){
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'No music is playing',
                });
                return;
            }

            const newTimestamp = await musicStreamRepository.calculateCurrentTimestamp(userId);
            await MusicStreamService.updateUserMusicState.execute(userId, state.currentMusicId, newTimestamp, false);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Music paused',
            })
        }catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`,
            })
        }
    }

    seekMusicApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }

            const musicId = req.params.musicId;
            const seekTime = Number(req.query.seek);

            await MusicStreamService.updateUserMusicState.execute(userId, musicId, seekTime, false);

            res.status(200).json({
                status: 200,
                success: true,
                message: 'Music seeked',
            })
        }catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`,
            })
        }
    }
    getUserMusicStateApi = async (req: IAuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).send("Unauthorized");
                return;
            }

            const state = await MusicStreamService.getUserMusicState.execute(userId);

            if (!state.currentMusicId) {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "No music is playing",
                    state: { currentMusicId: null, timestamp: 0, lastUpdated: 0, isPlaying: false }
                });
                return;
            }

            const newTimestamp = await musicStreamRepository.calculateCurrentTimestamp(userId);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Fetched user music state",
                state: {
                    ...state,
                    timestamp: newTimestamp
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                success: false,
                message: `Internal Server Error ${error.message}`,
            });
        }
    }
}

export default new MusicController();