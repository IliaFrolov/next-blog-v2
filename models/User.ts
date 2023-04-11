import { Schema, models, model, Model } from "mongoose";

export interface UserModelSchema {
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin';
    provider: 'github';
}
const UserSchema = new Schema<UserModelSchema>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: "user",
        },
        provider: {
            type: String,
            enum: ['github']
        },
    },
    {
        timestamps: true,
    }
);

const User = models?.User || model("User", UserSchema);

export default User as Model<UserModelSchema>;
