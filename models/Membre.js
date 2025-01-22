import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// MEMBER SCHEMA

const membreSchema = mongoose.Schema(
    {
        credentials: {
            email: {
                type: String,
                required: true,
                unique: true,
            },
            password: {
                type: String,
                required: true,
            },
           
        },

        username: {
            type: String,
            required: true,
        },
        
        firstShirt: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shirt",
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
)

// add plugin that converts mongoose to json
membreSchema.plugin(toJSON);

export default mongoose.models.Membre || mongoose.model("Membre", membreSchema);