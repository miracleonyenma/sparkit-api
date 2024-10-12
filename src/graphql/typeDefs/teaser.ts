// ./src/graphql/typeDefs/teaser.ts

const teaserTypeDefs = `#graphql
  type Teaser {
    id: ID!
    content: String!
    spark: Spark!
    scheduledDate: String!
    sent: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateTeaserInput {
    content: String!
    spark: ID!
    scheduledDate: String!
  }

  input UpdateTeaserInput {
    content: String
    spark: ID
    scheduledDate: String
    sent: Boolean
  }

  type TeaserData {
    data: [Teaser]
    meta: Meta
  }

  input TeaserFilter {
    content: String
    spark: ID
    scheduledDate: String
    sent: Boolean
  }

  input GenerateTeasersInput {
    sparkId: ID!
    numTeasers: Int!
    description: String!
    style: String!
  }

  extend type Query {
    teasers(filter: TeaserFilter, pagination: Pagination): TeaserData
    teaser(id: ID!): Teaser
  }

  extend type Mutation {
    generateTeasers(input: GenerateTeasersInput!): [Teaser]
    createTeaser(input: CreateTeaserInput!): Teaser
    updateTeaser(id: ID!, input: UpdateTeaserInput!): Teaser
    deleteTeaser(id: ID!): Teaser
  }
`;

export default teaserTypeDefs;
