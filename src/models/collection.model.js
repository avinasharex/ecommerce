import mongoose from "mongoose"

const collectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a collection name"],
            trim: true,
            maxLength: [120, "collection name should not more than 120 chars be more than 120 character"]
        }
    },
    {timestamps: true}
)

export default mongoose.model("collection", collectionSchema)

// "collection" stored in database is converted into lowercase and plural