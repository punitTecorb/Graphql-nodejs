# Graphql-nodejs

## Introduction
GraphQl api using nodejs with javascript.For create GraphQl api we are using graphql liberary in nodejs.

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.

Every GraphQL query goes through three phases: the queries are parsed, validated and executed.

GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need, makes it easier to evolve APIs over time, and enables powerful developer tools.

We require the main GraphQL package and use JavaScript Destructuring to get the necessary GraphQL functions(GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLList and GraphQLNonNull).

We import our two models (user and provider) and GraphQl Schema (schema).

These functions are used to define our GraphQL schema, similar to the Mongoose models defined earlier.

The fields can return a particular type, and methods that take arguments.

Then we declare the RootQuery which is also a GraphQL Object Type and is found at the top level of every GraphQL server. It represents all of the possible entry points into the GraphQL API.

We then declare our Mutations, which are used to change data. Although any query could be implemented to change data, operations that cause changes should be sent explicitly via a mutation.

## Query and Mutation code mention below -

const graphql = require('graphql');  
const user = require('../models/user');  
const provider = require('../models/provider');  


const {
   GraphQLObjectType, GraphQLString,
   GraphQLID, GraphQLInt,GraphQLSchema,
   GraphQLList,GraphQLNonNull
} = graphql;  



//Schema defines data on the Graph like object types(book type), relation between
//these object types and describes how it can reach into the graph to interact with
//the data to retrieve or mutate the data  



const userType = new GraphQLObjectType({
   name: 'user',
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
   name: 'provider',
   fields: () => ({
       id: { type: GraphQLID },
       name: { type: GraphQLString },
       email: { type: GraphQLString },
       desc:{type: GraphQLString},
       service:{type:GraphQLString}
   })
})



//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular
//book or get a particular author.
const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
       user: {
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
       providers:{
           type: new GraphQLList(providerType),
           resolve(parent, args) {
               return provider.find({});
           }
       }
   }
});

//Very similar to RootQuery helps users to add/update to the database.
const Mutation = new GraphQLObjectType({
   name: 'Mutation',
   fields: {
       addUser:{
           type:userType,
           args:{
               name: { type: new GraphQLNonNull(GraphQLString)},
               email: { type: new GraphQLNonNull(GraphQLString)},
               password: { type: new GraphQLNonNull(GraphQLString)}
           },
           resolve(parent,args){
               let user = new user({
                   name:args.name,
                   email:args.email,
                   password:args.password
               })
               return user.save()
           }
       },
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
       addProvider:{
        type:providerType,
        args:{
            name: { type: new GraphQLNonNull(GraphQLString)},
            email: { type: new GraphQLNonNull(GraphQLString)},
            desc: { type: new GraphQLNonNull(GraphQLString)},
            service: { type: new GraphQLNonNull(GraphQLString)}
        },
        resolve(parent,args){
            let provider = new provider({
                name:args.name,
                email:args.email,
                desc:args.desc,
                service:args.service
            })
            return provider.save()
        }
    }
   }
});


## Graph query requests -- 

Mutations - 
Signup ---
mutation{
  addUser(name: "punit",email: "punit@tecorb.co",password: "1234567"){
    id
    name
    email
  }
}

Login ---
mutation{
  loginUser(email: "punit@tecorb.co",password: "1234567"){
    id
    name
    email
  }
}

Add Provider ---
mutation{
  addProvider(name:"Punit Sharma",email: "punit@tecorb.co",desc: "Good Provider",service:"Car washing"){
    id
    name
    email
    desc
    service
  }
}

Query --
Get provider ---
{
  providers{
    id
    name
    email
    desc
    service
  }
} 

## Project Setup Steps:
### Required details for setup this project
   1. Add your mongodb database string in main file.
### Install project dependency
`npm install`
### local server
`node app.js`
### prod build
`node app.js`