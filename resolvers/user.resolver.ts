import { generateRandomString } from "../helpers/generate";
import User from "../models/user.model";
import md5 from "md5";

export const resolversUser = {
    Query: {
        getUser: async (_, args, context) => {
            const infoUser = await User.findOne({
                token: context["user"].token,
                deleted: false,
            });

            if (infoUser) {
                return {
                    code: 200,
                    message: "Success!",
                    id: infoUser.id,
                    fullName: infoUser.fullName,
                    email: infoUser.email,
                    token: infoUser.token,
                };
            } else {
                return {
                    code: 400,
                    message: "InSuccess!",
                };
            }
        },
    },
    Mutation: {
        registerUser: async (_, args) => {
            const { user } = args;

            const emailExist = await User.findOne({
                email: user.email,
                deleted: false,
            });

            if (emailExist) {
                return {
                    code: 400,
                    message: "Email da ton tai!",
                };
            } else {
                user.password = md5(user.password);
                user.token = generateRandomString(30);

                const newUser = new User(user);
                const data = await newUser.save();

                return {
                    code: 200,
                    message: "Dang ky thanh cong!",
                    id: data.id,
                    fullName: data.fullName,
                    email: data.email,
                    token: data.token,
                };
            }
        },
        loginUser: async (_, args) => {
            const { email, password } = args.user;

            const infoUser = await User.findOne({
                email: email,
                deleted: false,
            });

            if (!infoUser) {
                return {
                    code: 400,
                    message: "Email ko ton tai!",
                };
            }
            if (md5(password) !== infoUser.password) {
                return {
                    code: 400,
                    message: "Sai Password!",
                };
            }
            return {
                code: 200,
                message: "Login success!",
                id: infoUser.id,
                fullName: infoUser.fullName,
                email: infoUser.email,
                token: infoUser.token,
            };
        },
    },
};
