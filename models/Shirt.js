import mongoose from 'mongoose';
import toJSON from "./plugins/toJSON";


const shirtSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null, // means not yet claimed
    },
    assignedAt: {
        type: Date,
        default: null,
    },

    verificationCode: {
        type: String,
        default: null,
    },

    // Optionally track a status
    // e.g. "active", "inactive", "shipped", etc.
    status: {
        type: String,
        default: 'unclaimed',
        enum: ['unclaimed', 'claimed', 'blocked', 'inactive'],
    },

    // If you want to store meta info about the T-shirt
    name: {
        type: String,
        default: '',
    }

},
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }

);

// add plugin that converts mongoose to json
shirtSchema.plugin(toJSON);

export default mongoose.models.Shirt || mongoose.model('Shirt', shirtSchema);
