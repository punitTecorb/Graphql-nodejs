const { gql } = require('apollo-server-express');

const imageDefs = gql`
scalar Upload

type Mutation {
  uploadImage(file: Upload): Boolean
}

`
  export default imageDefs