import multer from 'multer'
import {Request, Response} from "express";
import {
    createMusic,
    getAllMusic,
    getMusicByArtist,
    getMusicByCategory
} from "../services/MusicBaseService.js";
import {IMusicFile} from "../interface/IMusicFile.js";

const uploadMulter = multer({
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('audio/')) {
            console.log("File is not musicFile")
            return cb(null, false);
        }
        cb(null, true);
    }
});
export const createMusicApi = [
    uploadMulter.single('musicFile'),
    async (req: Request, res: Response) => {
        try {
            const { name, artist, duration, category } = req.body;

            const musicFile = req.file;
            
            if (!musicFile) {
                res.status(400).json({ message: "No music file uploaded" });
                return;
            }
            
            if (!name || !artist || !duration || !category) {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'All fields (name, artist, duration, category, musicFile) are required',
                });
                return;
            }
            
            const fileObject: IMusicFile = {
                originalName: musicFile.originalname, 
                mimetype: musicFile.mimetype,
                buffer: musicFile.buffer, 
            };
            
            const newMusic = await createMusic({
                name,
                artist,
                duration,
                category,
            }, fileObject);

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


export const getAllMusicsApi = async (_req: Request, res: Response) => {
    try {
        const musics = await getAllMusic();

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Fetched all music successfully',
            musics,
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

export const getMusicByArtistApi = async (req: Request, res: Response) => {
    try {
        const { artist } = req.body;

        if (!artist) {
            res.status(400).json({
                status: 400,
                success: false,
                message: 'Artist is required',
            });
            return;
        }

        const musicsByArtist = await getMusicByArtist(artist);
        
        if (!musicsByArtist) {
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
            musics: musicsByArtist,
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

export const getMusicByCategoryApi = async (req: Request, res: Response) => {
    try {
        const { category } = req.body;

        if (!category) {
            res.status(400).json({
                status: 400,
                success: false,
                message: 'Category is required',
            });
            return;
        }

        const musicsByCategory = await getMusicByCategory(category);

        if (!musicsByCategory) {
            res.status(404).json({
                status: 404,
                success: false,
                message: `No music found for category: ${category}`,
            });
            return;
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: `Fetched music by category: ${category}`,
            musics: musicsByCategory,
        });
    } catch (error: unknown) {
        console.error('Error fetching music by category:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
        });
    }
};
