import {IUser} from "./IUser.js";
import {UserDto} from "../dto/UserDto.js";

export interface IUserBaseRepository {
    createUser(user: IUser): Promise<void>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getAllUsers(): Promise<UserDto[] | null>;
    getUserCustomToken(userIdentifier: string): Promise<string | null>;
}