import { gql } from "apollo-server";

export default gql`
  type Photo {
    id: Int!
    user: User!
    file: String!
    caption: String
    hashtags: [Hashtag]
    createdAt: String!
    updatedAt: String!
    isMine: Boolean!
  }
  type Hashtag {
    id: Int!
    hashtag: String!
    photos(offset: Int!): [Photo]
    totalPhotos: Int!
    createdAt: String!
    updatedAt: String!
  }
`;
