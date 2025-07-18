import {Lifecycle, scoped} from "tsyringe";
import {musicUserRepository} from "../../config/container/Container.js";
import {IMusicUserService} from "../../interface/service/IMusicUserService.js";
@scoped(Lifecycle.ResolutionScoped)
export class UploadMusicByUserService {
    execute: IMusicUserService["uploadMusicByUser"] = async (music, musicFile, imgFile) => {
        const loveCount = 0;
        const playCount = 0;

        if(!await musicUserRepository.isUserExist(<string>music.userId)) {
            return Promise.reject(new Error(("Error upload new music: User is not exist")));
        }

        const musicData = {
            ...music,
            loveCount,
            playCount,
            musicFile,
            imgFile
        }

        return await musicUserRepository.uploadMusicByUser(musicData)
    }
}