import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            // Password is only required for local auth
            return this.authProvider === 'local';
        },
        minlength: 6,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows null values while maintaining uniqueness
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    role: {
        type: String,
        default: "user",
    },
})

const User = mongoose.model('User', userSchema);
export default User;
