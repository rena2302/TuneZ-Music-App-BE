import {inject, injectable} from "tsyringe";
import {UserBaseRepository} from "../repository/UserBaseRepository.js";
import {IUserBaseService} from "../interface/service/IUserBaseService.js";
@injectable()
export class GetUserCustomTokenService {
    constructor(@inject("UserBaseRepository") private repository: UserBaseRepository) {}

    execute: IUserBaseService["getUserCustomToken"] = async (email, cookie) => {
        try {
            const userIdentifier = cookie || email;
            return userIdentifier ? await this.repository.getUserCustomToken(userIdentifier) : null;
        }catch (error) {
            throw new Error(`Failed to get user custom token: ${error.message}`);
        }
    }
}