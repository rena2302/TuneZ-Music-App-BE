import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {musicBaseMediator} from "../../config/container/Container.js";
import {GetMusicByArtistQuery} from "./query/GetMusicByArtistQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GetMusicByArtistService{
    execute: IMusicBaseService["getMusicByArtist"] = async (artist) => {
        return await musicBaseMediator.send(new GetMusicByArtistQuery(artist));
    };
}
