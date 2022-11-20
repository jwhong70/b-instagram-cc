import { gql } from "apollo-server";

export default gql`
  type Query {
    seeFollowers(username: String!, offset: Int!): SeeFollowersResult!
  }
  type SeeFollowersResult {
    ok: Boolean!
    error: String
    followers: [User]
    totalPages: Int
  }
`;
