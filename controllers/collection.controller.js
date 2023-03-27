import Collection from "../models/collection.schema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"



/*************************************************************************
    @Create_COLLECTION
    @route http://localhost:4000/api/auth/collection
    @description User signup controller for creating a new user
    @parameters name, email, password
    @return User Object
************************************************************************/
export const createCollection = asyncHandler(async (req, res) => {
    // take name from front end
    const { name } = req.body;
    if (!name) {
        throw new CustomError("Collection name is required", 400)
    }
    // add name to db
    const collection = await Collection.create({ name })

    // send this response value to frontend
    res.status(200).json({
        success: true,
        message: "Collection created with success",
        collection
    })
})


export const updateCollection = asyncHandler(async (req, res) => {
    // existin value to be updated
    const { id: collectionId } = req.params;

    // new value to get updated
    const { name } = req.body;

    if (!name) {
        throw new CustomError("Collection name is required", 400)
    }

    let updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        { name },
        {
            new: true, // once upated, give response the new updated value
            runValidators: true, // moongose schema validators that you applied
        }
    )

    if (!updateCollection) {
        throw new CustomError("Collection not found", 400)
    }

    // send response to front end
    res.status(200).json({
        success: true,
        message: "Collection updated successfully",
        updateCollection
    })
})


export const deleteCollection = asyncHandler(async (req, res) => {
    // get the id
    const { id: collectionId } = req.params;

    const collectionToDelete = await Collection.findByIdAndDelete(collectionId)

    if (!collectionToDelete) {
        throw new CustomError("Collection not found", 400)
    }

    // send response to front end
    res.status(200).json({
        success: true,
        message: "Collection deleted successfully",
        collectionToDelete // you may not send the deleted collection
    })
})


export const getAllCollection = asyncHandler(async (req, res) => {
    const collections = await Collection.find()

    if (!collections) {
        throw new CustomError("No Collection found",)
    }

    res.status(200).json({
        success: true,
        collections
    })
})
