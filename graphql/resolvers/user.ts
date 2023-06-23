import userModel from "../models/user";
import { ApolloError } from "apollo-server";


const user_resolvers = {
    Query: {
        async getUser(_: any, ID: any) {
            var id = ID
            console.log(id, "id", id.ID)
            const details = await userModel.findById({ _id: id.ID })
            if (details) {
                console.log(details, "details1222")
                details.name = "ssss"
                details.count = 12
                return details;
            } else {
                throw new ApolloError('User is not exists')
            }
        },
        async user(_: any, count: any) {
            var limit = count
            const list = await userModel.find().sort({ createdAt: -1 }).limit(limit.amount)
            return list
        }
    },
    Mutation: {
        //add
        async createUser(_: any, userInput: any) {
            const data = userInput
            const { name, email, phoneNumber, address, qualification } = data.userInput
            const body = {
                "name": name,
                "email": email,
                "phoneNumber": phoneNumber,
                "details": {
                    "address": address,
                    "qualification": qualification
                }
            }
            const details = await userModel.findOne({ email: email });
            if (details) {
                throw new ApolloError('User is already exists')
            } else {
                const res: any = (await userModel.create(body)).save();
                return { res };
            }
        },
        //edit
        async editUser(_: any, ID: any, userInput: any) {
            const data = ID
            const { name, email, phoneNumber } = data.userInput
            const id = data.ID
            const res = (await userModel.updateOne({ _id: id }, { name: name, email: email, phoneNumber: phoneNumber })).modifiedCount;
            return res;
        },
        //delete
        async deleteUser(_: any, ID: any) {
            const data = ID
            const id = data.ID
            const res = (await userModel.deleteOne({ _id: id })).deletedCount
            return { res };
        },
    }
}
export default user_resolvers;