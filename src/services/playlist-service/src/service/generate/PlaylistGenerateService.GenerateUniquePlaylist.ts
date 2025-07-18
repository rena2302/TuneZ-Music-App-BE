import {IPlaylistGenerateService} from "../../interface/service/IPlaylistGenerateService.js";
import {generateThrowBackPlaylist} from "./PlaylistGenerateService.GenerateThrowBackPlaylist.js";
import {generateRecentPlaylist} from "./PlaylistGenerateService.GenerateRecentPlaylist.js";
import {generateDaylist} from "./PlaylistGenerateService.GenerateDaylist.js";
import {PlaylistTitle} from "../../enum/PlaylistTitle.js";
import {generateRepo} from "../../repository/PlaylistGenerateRepository.js";
import PlaylistCacheService from "../cache/PlaylistCacheService.js";

export const generateUniquePlaylist: IPlaylistGenerateService['generateUniquePlaylist'] = async (userId, playlistLimit, historyLimit) => {
    try {
        if (!await generateRepo.isUserExists(userId)) {
            return Promise.reject(new Error("User not found"));
        }

        const cachedPlaylist = await PlaylistCacheService.getFromCache(userId, 'unique');
        if (cachedPlaylist) {
            console.log(`Using cached recent playlist for user: ${userId}`);
            return {[PlaylistTitle.UNIQUE]: cachedPlaylist};
        }

        const [recentPlaylist, throwbackPlaylist, daylistPlaylist] = await Promise.all([
            generateRecentPlaylist(userId, playlistLimit, historyLimit),
            generateThrowBackPlaylist(userId, playlistLimit, historyLimit),
            generateDaylist(userId, playlistLimit)
        ]);

        const playlistResponse = [
            ...(recentPlaylist || []), 
            ...(throwbackPlaylist || []),
            ...(daylistPlaylist || [])
        ];
        
        await PlaylistCacheService.saveToCache(userId, 'unique', playlistResponse);

        return {
            [PlaylistTitle.UNIQUE]: playlistResponse
        };
    }catch (error) {
        throw error;
    }
};