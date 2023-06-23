import { GraphQLUpload } from "graphql-upload-minimal";
import { CustomError } from "../util/errors";
import { StatusCodes } from "http-status-codes";
import image_uploader from "../util/imageUploader";
import vendorModel from "../models/vendor";
import { AuthenticationError } from "apollo-server-core";
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


const image_resolvers = {
    Upload: GraphQLUpload,
    Mutation: {
        uploadImage: async (_: any, file: any, userId: any) => {
            return new Promise(async (resolve, reject) => {
                try {
                    console.log(userId, "s;lslslsl")
                    if (JSON.stringify(userId) === '{}') {
                        console.log(userId, "flfllflflfllf")
                        reject(new CustomError('Token Expired', StatusCodes.BAD_GATEWAY))
                    } else {
                        if (!(file.file)) {
                            reject(new CustomError('Please Upload Image', StatusCodes.BAD_GATEWAY))
                        } else {
                            const { createReadStream, filename } = await file.file;
                            const uploadOptions = {
                                folder: 'uploads', // Optional: Set a folder name for organizing your uploads
                                public_id: filename, // Optional: Set a specific public_id for the uploaded image
                            };
                            createReadStream()
                                .pipe(cloudinary.uploader.upload_stream(uploadOptions, async (error: any, result: any) => {
                                    if (error) {
                                        reject(error);
                                    } else {
                                        const updateProfile = (await vendorModel.updateOne({ _id: userId.id }, { image: result.secure_url })).modifiedCount
                                        resolve(updateProfile);
                                    }
                                }));
                        }
                    }
                } catch (err) {
                    reject(err);
                }
            });
        },
    },
};

export default image_resolvers;