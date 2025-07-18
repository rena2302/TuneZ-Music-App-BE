import {IUserRepository} from "../interface/repository/IUserRepository.js";
import {followServiceClient, playlistServiceClient} from "../grpc/client/GrpcClients.js";
import {singleton} from "tsyringe";
import {database} from "../config/firebase/FireBaseConfig.js";
import {SubscriptionType} from "../enum/SubscriptionType.js";
@singleton()
export class UserRepository implements IUserRepository {
    async getFollowerCount(userId: string): Promise<any> {
        return await new Promise<number>((resolve, reject) => {
            followServiceClient.getFollowerCount({ userId }, (err: any, response: any) => {
                if (err) {
                    reject(new Error(`gRPC error: ${err.message}`));
                    return;
                }
                resolve(response.count);
            });
        });

    }

    async getFollowingCount(userId: string): Promise<any> {
        return await new Promise<number>((resolve, reject) => {
            followServiceClient.getFollowingCount({ userId }, (err: any, response: any) => {
                if (err) {
                    reject(new Error(`gRPC error: ${err.message}`));
                    return;
                }
                resolve(response.count);
            });
        });
    }

    async getPlaylist(userId: string): Promise<any> {
        return await new Promise<any[]>((resolve, reject) => {
            playlistServiceClient.getUserPlaylist({ userId }, (err: any, response: any) => {
                if (err) {
                    reject(new Error(`gRPC error: ${err.message}`));
                    return;
                }
                resolve(response.playlists);
            });
        });
    }

    async getFollowing(userId: string): Promise<any> {
        return await new Promise<any[]>((resolve, reject) => {
            followServiceClient.getFollowing({ userId }, (err: any, response: any) => {
                if (err) {
                    reject(new Error(`gRPC error: ${err.message}`));
                    return;
                }
                resolve(response.following);
            });
        });
    }

    async getUserLibrary(userId: string): Promise<any> {
        const following = await this.getFollowing(userId);

        const userPlaylists = await this.getPlaylist(userId);

        return {
            userPlaylists,
            following,
        };
    }

    async updateSubscriptionType(userId: string): Promise<boolean> {
        const userRef = database.ref(`users/${userId}`);
        const userSnapshot = await userRef.get();
        const user = userSnapshot.val();

        const newSubscriptionType =
            user.account.subscriptionType === SubscriptionType.PREMIUM
                ? SubscriptionType.NORMAL
                : SubscriptionType.PREMIUM;

        await userRef.update({
            account: {
                ...user.account,
                subscriptionType: newSubscriptionType
            }
        });

        return true;
    }
}