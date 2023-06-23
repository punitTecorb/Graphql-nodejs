# Graphql-nodejs

## Introduction
GraphQl api using nodejs with javascript and typescript. For create GraphQl api we are using graphql liberary in nodejs.

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.

Every GraphQL query goes through three phases: the queries are parsed, validated and executed.

GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need, makes it easier to evolve APIs over time, and enables powerful developer tools.

We require the main GraphQL package and use JavaScript Destructuring to get the necessary GraphQL functions(GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLList and GraphQLNonNull).

We import our two models (user and provider) and GraphQl Schema (schema).

These functions are used to define our GraphQL schema, similar to the Mongoose models defined earlier.

The fields can return a particular type, and methods that take arguments.

Then we declare the RootQuery which is also a GraphQL Object Type and is found at the top level of every GraphQL server. It represents all of the possible entry points into the GraphQL API.

We then declare our Mutations, which are used to change data. Although any query could be implemented to change data, operations that cause changes should be sent explicitly via a mutation.

## GraphQl Base url -- 
http://localhost:5000/graphql

## GraphQl  -

const graphql = require('graphql');  

const {  
   GraphQLObjectType, GraphQLString,  
   GraphQLID, GraphQLInt,GraphQLSchema,  
   GraphQLList,GraphQLNonNull  
} = graphql;    

## Query and Mutation code mention below -

## User query and mutation
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

## Vendor query and mutation
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

## Project Setup Steps:
### Required details for setup this project
   1. Add your mongodb database string in env file
   2. Add your jwt token in env file.
### Install project dependency
`npm install`
### local server
`npm run start:dev`
### prod build
`npm run start:dev`