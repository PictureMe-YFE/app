import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({

    shirtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shirt',
        required: true,
    },

    FrontImageUrl: {
        type: String,
        required: true, // store the final URL or a path (e.g. from AWS S3, Cloudinary, etc.)
    },

    BackImageUrl: {
        type: String,
        required: true, // store the final URL or a path (e.g. from AWS S3, Cloudinary, etc.)
    },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    });

export default mongoose.models.Photo || mongoose.model('Photo', photoSchema);
