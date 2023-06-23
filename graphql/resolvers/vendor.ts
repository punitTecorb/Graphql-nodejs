import sessionModel from "../models/session";
import vendorModel from "../models/vendor";
import { ApolloError, AuthenticationError } from "apollo-server";
const jwt = require('jsonwebtoken');
import bcrypt from 'bcrypt'
import upload from "../util/imageUploader";
import { CustomError } from "../util/errors";
import { StatusCodes } from "http-status-codes";

const vendor_resolvers = {
    Query: {
        getVendor: async (_: any, ID: any, userId: any) => {
            return new Promise(async (resolve, reject) => {
                if (JSON.stringify(userId) === '{}') {
                    reject(new CustomError('Invalid Token', StatusCodes.NON_AUTHORITATIVE_INFORMATION));
                } else {
                    const details = await vendorModel.findById({ _id: userId.id })
                    if (details) {
                        details.name = "ssss"
                        details.count = 12
                        resolve({ vendor: details, message: "Success", code: 200 });
                    } else {
                        reject(new CustomError('Vendor is not exists', StatusCodes.BAD_REQUEST))
                    }
                }
            })
        },
        async vendor(_: any, count: any) {
            return new Promise(async (resolve, reject) => {
                try {
                    var limit = count
                    let Array: any = []
                    const list = await vendorModel.find().sort({ createdAt: -1 }).skip((limit.perPage * limit.page) - limit.perPage).limit(limit.perPage);
                    const totalCount = await vendorModel.count();
                    if (list.length) {
                        list.map((data: any) => {
                            if (data.name == "Aashu") {
                                data.totalSum = 2
                            }
                            Array.push(data)
                        })
                    }
                    resolve(
                        {
                            totalCount: totalCount,
                            vendorList: Array,
                            message: "Record fetch successfully",
                            code: StatusCodes.OK
                        }
                    );
                } catch (err) {
                    reject(err);
                }
            })

        }
    },
    Mutation: {
        //add
        async createVendor(_: any, vendorInput: any) {
            const data = vendorInput
            const { name, email, phoneNumber, password } = data.vendorInput
            const body: any = {
                "name": name,
                "email": email,
                "phoneNumber": phoneNumber
            }
            const details = await vendorModel.findOne({ email: email });
            if (details) {
                throw new ApolloError('Vendor is already exists')
            } else {
                const pass = bcrypt.hashSync(password, 10);
                body.password = pass;
                const res: any = await vendorModel.create(body);
                const token: string = jwt.sign({
                    id: res.id,
                    role: "Vendor",
                    userId: res._id
                }, 'str34eet', { expiresIn: '30d' })
                await sessionModel.create({ role: "Vendor", userId: res._id, status: true, token: token });
                res.token = token
                return (res);
            }
        },
        //login
        async loginVendor(_: any, loginInput: any) {
            try {
                const input = loginInput
                const details: any = await vendorModel.findOne({ email: input.loginInput.email });
                if (details) {
                    var match = bcrypt.compareSync(input.loginInput.password, details.password);
                    if (match == false) {
                        throw new Error('Wrong Password')
                    } else {
                        const token: any = jwt.sign({
                            id: details.id,
                            role: "Vendor",
                            userId: details._id
                        }, 'str34eet', { expiresIn: '30d' })
                        await sessionModel.create({ role: "Vendor", userId: details._id, status: true, token: token });
                        details.token = token
                        return {
                            vendor: details,
                            message: 'Login successfully',
                            code: 200
                        };
                    }
                } else {
                    throw new Error('Eamil is not Exists')
                }

            } catch (err: any) {
                throw new Error(err.message)
            }
        },
        //edit
        async editVendor(_: any, ID: any,) {
            // if (JSON.stringify(user) === '{}') {
            //     throw new AuthenticationError('Token Expired')
            // } else {
                const data = ID
                console.log(data.ID,"LSLS")

                const { name, email, phoneNumber } = data.vendorInput
                const res = (await vendorModel.updateOne({ _id: data.ID }, { name: name, email: email, phoneNumber: phoneNumber })).modifiedCount;
                return res;
            // }

        },
        //delete
        async deleteVendor(_: any, ID: any) {
            const data = ID
            const id = data.ID
            const res = (await vendorModel.deleteOne({ _id: id })).deletedCount
            return { res };
        },
    }
}
export default vendor_resolvers;

