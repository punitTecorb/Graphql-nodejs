const graphql = require('graphql');
var user = require('../models/user');
var provider = require('../models/provider');

const {
   GraphQLObjectType, GraphQLString,
   GraphQLID, GraphQLInt,GraphQLSchema,
   GraphQLList,GraphQLNonNull
} = graphql;

//Schema defines data on the Graph like object types(book type), relation between
//these object types and describes how it can reach into the graph to interact with
//the data to retrieve or mutate the data  

const userType = new GraphQLObjectType({
   name: 'User',
   //We are wrapping fields in the function as we dont want to execute this ultil
   //everything is inilized. For example below code will throw an error AuthorType not
   //found if not wrapped in a function
   fields: () => ({
       id: { type: GraphQLID  },
       name: { type: GraphQLString },
       email: { type: GraphQLString },
       password: {type: GraphQLString}
   })
});

const providerType = new GraphQLObjectType({
   name: 'Provider',
   fields: () => ({
       id: { type: GraphQLID },
       name: { type: GraphQLString },
       email: { type: GraphQLString },
       desc:{type: GraphQLString},
       service:{type:GraphQLString}
   })
});

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular
//book or get a particular author.
const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
        // Get user data based on id in query
        userData: {
            type: userType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
               //Here we define how to get data from database source
               //this will return the book with id passed in argument
               //by the user
               return user.findById(args.id);
            }
        },
        // Get user count
        userCount: {
            type: userType,
            args: {},
            resolve(parent, args) {
               return user.countDocuments();
            }
        },
        // Get all providers
        providers:{
            type: new GraphQLList(providerType),
            resolve() {
               return provider.find({});
            }
        },
        // Get all providers with pagination
        providers:{
            type: new GraphQLList(providerType),
            resolve() {
               return provider.find({}).skip(10*1).limit(10);
            }
        }
    }
});

//Very similar to RootQuery helps users to add/update to the database.
const Mutation = new GraphQLObjectType({
   name: 'Mutation',
   fields: {
        // Create user    
        addUser:{
            type:userType,
            args:{
                name: { type: new GraphQLNonNull(GraphQLString)},
                email: { type: new GraphQLNonNull(GraphQLString)},
                password: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                let User = new user({
                    name:args.name,
                    email:args.email,
                    password:args.password
                })
                return User.save();               
            }
        },
        //Login user by email and password
        loginUser:{
            type:userType,
            args:{
                email: { type: new GraphQLNonNull(GraphQLString)},
                password: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                return user.findOne(args);
            }
        },
        // Get user based on id
        getUser:{
            type:userType,
            args:{
                _id: { type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent,args){
                return user.findOne(args);
            }
        },
        // Create provider
        addProvider:{
            type:providerType,
            args:{
                name: { type: new GraphQLNonNull(GraphQLString)},
                email: { type: new GraphQLNonNull(GraphQLString)},
                desc: { type: new GraphQLNonNull(GraphQLString)},
                service: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                let Provider = new provider({
                    name:args.name,
                    email:args.email,
                    desc:args.desc,
                    service:args.service
                })
                return Provider.save()
            }
        },
        // Get provider based on id
        getProviderById:{
            type:providerType,
            args:{
                _id: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                return provider.findOne(args);
            }
        }
    }
});

//Creating a new GraphQL Schema, with options query which defines query
//we will allow users to use when they are making requests.
module.exports = new GraphQLSchema({
   query: RootQuery,
   mutation: Mutation
});