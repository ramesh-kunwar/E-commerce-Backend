import mongoose from "mongoose"

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a product name"],
        trim: true,
        maxLength: [120, "Product name should be a max of 120 characters"]

    },
    price: {
        type: Number,
        required: [true, "Please provide a product price"],
        maxLength: [5, "Product price should not be more than 5 digits"],

    },
    description: {
        type: String,
        // use some sort of editor - personal assignment
    },
    photos: [
        {
            secure_url: {
                type: String,
                required: true,
            }
        }
    ],
    stock: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },

    // each product should be a part of collection or category
    // so keep a reference in every single entry made in the db, store reference in a collection

    // -> every product should be of category/collection
    collectionId:{
        type : mongoose.Schema.Types.ObjectId, // this is always same
        ref: "Collection" // this is the name of the model // collection another model
    }

}, { timestamps: true })

export default mongoose.Schema("Product", productSchema)