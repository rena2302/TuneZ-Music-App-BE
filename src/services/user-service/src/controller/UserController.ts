import {NextFunction, Request, Response} from 'express';
import { auth } from "../config/firebase/FireBaseConfig.js";
import {UserBaseService} from '../service/UserBaseService.js';
import {mailService} from "../util/base/MailBase.js";

class UserController {
    getAllUsersApi = async (_req: Request, res: Response) => {
        try {
            const users = await UserBaseService.getAllUsersService.execute();
            res.status(200).json({ status: 200, users });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ status: 500, message: error.message });
            } else {
                res.status(500).json({ status: 500, message: 'Error fetching users' });
            }
        }
    };

    getUserCustomTokenApi = async (req: Request, res: Response) => {
        try {
            const email = req.query.email as string;

            const token = await UserBaseService.getUserCustomToken.execute(email);

            res.status(200).json({ status: 200, token });

        }catch (error) {
            res.status(500).json({ status: 500, success: false, message: error.message });
        }
    }
    registerApi = async (req: Request, res: Response) => {
        try {
            const { email, password, username } = req.body;

            await auth.createUser({
                email,
                password,
                displayName: username,
            });

            const link = await auth.generateEmailVerificationLink(email);
            await mailService.sendVerificationEmail(email, link);
            const firebaseUser = await auth.getUserByEmail(email);

            const newUser = await UserBaseService.createUserService.execute({
                _id: firebaseUser.uid,
                email,
                username,
            });

            res.status(201).json({
                status: 201,
                success: true,
                message: 'Register successfully',
                user: newUser,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error registering user:', error.message);
                res.status(500).json({ status: 500, success: false, message: error.message });
            } else {
                res.status(500).json({ status: 500, success: false, message: 'Error registering user' });
            }
        }
    };

    sendVerificationEmailApi = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const link = await auth.generateEmailVerificationLink(email);
            await mailService.sendVerificationEmail(email, link);

            res.status(200).json({ status: 200, message: 'Send Verification Email Successfully' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ status: 500, message: error.message });
            } else {
                res.status(500).json({ status: 500, message: 'Error sending email' });
            }
        }
    };

    sendForgetPasswordApi = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const link = await auth.generatePasswordResetLink(email);
            await mailService.sendResetPasswordEmail(email, link);

            res.status(200).json({ status: 200, message: 'Send Reset Password Email Successfully' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ status: 500, message: error.message });
            } else {
                res.status(500).json({ status: 500, message: 'Error sending forget password' });
            }
        }
    };

    sendOtpEmailApi = async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ status: 400, success: false, message: 'Email is required' });
            return;
        }

        try {
            // Gửi OTP qua email
            await mailService.sendOtpEmail(email);

            // Phản hồi nếu thành công
            res.status(200).json({
                status: 200,
                success: true,
                message: 'OTP has been sent successfully',
            });
            return;
        } catch (error: unknown) {
            // Xử lý lỗi nếu có vấn đề
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error occurred';

            res.status(500).json({
                status: 500,
                success: false,
                message: `Failed to send OTP: ${errorMessage}`,
            });
            return;
        }
    }

    verifyOtpEmailApi = async (req: Request, res: Response) => {
        const { email , otp } = req.body;


        if (!email || !otp) {
            res.status(400).json({status: 400, success: false, message: 'Email & Otp is required' });
            return;
        }

        try {
            await mailService.verifyOtp(email, otp);
            res.status(200).json({
                status: 200,
                success: true,
                message: 'OTP has been verified',
            });
            return;
        }
        catch (error: unknown) {
            // Xử lý lỗi nếu có vấn đề
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error occurred';

            res.status(500).json({
                status: 500,
                success: false,
                message: `Failed to verify OTP: ${errorMessage}`,
            });
            return;
        }
    }
}

export default new UserController();