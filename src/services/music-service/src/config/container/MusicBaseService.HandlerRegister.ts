import { container, musicBaseMediator } from "./Container.js";
import { CreateMusicHandler } from "../../service/music_base/handler/CreateMusicHandler.js";
import { GetAllMusicHandler } from "../../service/music_base/handler/GetAllMusicHandler.js";
import { GetMusicByArtistHandler } from "../../service/music_base/handler/GetMusicByArtistHandler.js";
import { GetMusicByGenresHandler } from "../../service/music_base/handler/GetMusicByGenresHandler.js";
import { CreateMusicCommand } from "../../service/music_base/command/CreateMusicCommand.js";
import { GetAllMusicQuery } from "../../service/music_base/query/GetAllMusicQuery.js";
import { GetMusicByArtistQuery } from "../../service/music_base/query/GetMusicByArtistQuery.js";
import { GetMusicByGenresQuery } from "../../service/music_base/query/GetMusicByGenresQuery.js";
import {GetMusicUrlByIdQuery} from "../../service/music_base/query/GetMusicUrlByIdQuery.js";
import {GetMusicUrlByIdHandler} from "../../service/music_base/handler/GetMusicUrlByIdHandler.js";
import {GetMusicDurationByIdQuery} from "../../service/music_base/query/GetMusicDurationByIdQuery.js";
import {GetMusicDurationByIdHandler} from "../../service/music_base/handler/GetMusicDurationByIdHandler.js";

//Commands
musicBaseMediator.register(CreateMusicCommand, container.resolve(CreateMusicHandler));

//Queries
musicBaseMediator.register(GetAllMusicQuery, container.resolve(GetAllMusicHandler));
musicBaseMediator.register(GetMusicByArtistQuery, container.resolve(GetMusicByArtistHandler));
musicBaseMediator.register(GetMusicByGenresQuery, container.resolve(GetMusicByGenresHandler));
musicBaseMediator.register(GetMusicUrlByIdQuery, container.resolve(GetMusicUrlByIdHandler));
musicBaseMediator.register(GetMusicDurationByIdQuery, container.resolve(GetMusicDurationByIdHandler));
