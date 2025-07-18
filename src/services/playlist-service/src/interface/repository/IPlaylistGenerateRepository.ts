import { IGenre } from "../object/IGenre.js";

export interface IPlaylistGenerateRepository {
    isUserExists(userId: string): Promise<boolean>;
    getIdsArtistFollowed(userId: string): Promise<string[]>;
    getArtistName(artistId: string): Promise<string>;
    getGenresFromArtist(artistId: string): Promise<IGenre[]>;
    getThrowBackMusicIds(userId: string, historyLimit: number): Promise<string[]>;
}