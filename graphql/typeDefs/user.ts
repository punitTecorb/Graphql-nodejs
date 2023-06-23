import { gql } from 'apollo-server'
const userDefs = gql`
type User {
    name:String
    email:String
    phoneNumber:Int 
    createdAt:String
    updatedAt:String
    _id:String
    count:Int
}

input UserInput {
    name:String
    email:String
    phoneNumber:Int
    address:String
    qualification:String
    }

type Query {
    getUser(ID:ID!):User!
    user(count:Int):[User]
}

type Mutation{
    createUser(userInput:UserInput):User!
    deleteUser(ID:ID!):Boolean
    editUser(ID:ID!,userInput:UserInput):Boolean
}`
export default userDefs;