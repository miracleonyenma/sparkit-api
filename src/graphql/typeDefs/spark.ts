const sparkTypeDefs = `#graphql
  type Spark {
    id: ID!
    title: String!
    contentUrl: String!
    fileType: String!
    description: String
    category: SparkCategory!
    createdAt: String!
    creator: User! # Refers to the user who created the spark
    launchDate: String!
    subscribers: [User!]! # List of subscribers for this spark
    isLaunched: Boolean!
  }

  type SparksData {
    data: [Spark]
    meta: Meta
  }

  input SparkFilter {
    title: String
    category: ID
    fileType: String
    creator: ID
    launchDate: String
    isLaunched: Boolean
  }

  input SparkInput {
    title: String!
    category: ID
    contentUrl: String!
    fileType: String!
    description: String
    launchDate: String!
  }

  type Query {
    sparks(filter: SparkFilter, pagination: Pagination): SparksData! # Returns a list of sparks for authenticated user
    allSparks(filter: SparkFilter, pagination: Pagination): SparksData! # Returns a list of all sparks
    spark(id: ID!): Spark! # Returns a single spark
  }

  type Mutation {
    createSpark(input: SparkInput!): Spark! # Creates a new spark
    updateSpark(id: ID!, input: SparkInput!): Spark! # Updates an existing spark
    deleteSpark(id: ID!): Spark! # Deletes a spark
    subscribeToSpark(id: ID!): Spark! # Subscribes to a spark
    unsubscribeFromSpark(id: ID!): Spark! # Unsubscribes from a spark
  }
`;

export default sparkTypeDefs;
