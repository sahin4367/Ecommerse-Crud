import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img_path: {
        type: String,
        default: null
    },
    featured: {
        type: Boolean,
        default: false 
    }
})

export const Category = mongoose.model("Category", categorySchema);