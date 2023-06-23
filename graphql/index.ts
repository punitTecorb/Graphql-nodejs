import './pre-start';
import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import mongoose, { Mongoose } from 'mongoose'
import express from 'express'
import typeDefs from './typeDefs';
import resolvers from './resolvers';
const jwt = require('jsonwebtoken');
import cors from 'cors'
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import mongodb_connect from './util/database';
import { CustomError } from './util/errors';
import { StatusCodes } from 'http-status-codes';
import { resolve } from 'path';

const PORT = process.env.PORT;
var app = express();
mongodb_connect();
//Apollo server connection
async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers,
        context: ({ req }) => {
            return new Promise(async (resolve, reject) => {
                const authHeader = req.headers.authorization;
                const role: any = req.headers.role;
                if (authHeader) {
                    try {
                        const decoded = jwt.verify(authHeader, 'str34eet');
                        if (!decoded) {
                            reject(new CustomError('Invalid Token', StatusCodes.BAD_REQUEST));
                        } else {
                            if (!role) {
                                reject(new CustomError('Invalid Role? Role must be [User,Vendor]', StatusCodes.BAD_REQUEST));
                            } else {
                                if (role == decoded.role) {
                                    resolve(decoded);
                                } else {
                                    reject(new CustomError('Invalid Role', StatusCodes.BAD_REQUEST));
                                }
                            }
                        }
                    } catch (err: any) {
                        reject(new AuthenticationError(err.message));
                    }
                }
                // If there is no authorization header, return an empty object in the context
                resolve({});
            })

        },
    });
    app.use(graphqlUploadExpress())
    await server.start();
    // Apply any desired middleware to the Express app
    // Example: CORS middleware
    app.use(cors());

    // Apply the Apollo Server middleware to the app
    server.applyMiddleware({ app });
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
}
startApolloServer().catch((err) => {
    console.error('Failed to start Apollo Server:', err);
});


// mongoose.connect(MONGODB)
//     .then(() => {
//         console.log('Mongodb connected');
//         return app.listen({ port: process.env.PORT })
//     })
//     .then((res) => {
//         console.log(`server is running at ${process.env.PORT}`)
//     })