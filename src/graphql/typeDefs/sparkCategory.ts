const sparkCategoryTypeDefs = `#graphql
  type SparkCategory {
    id: ID!
    name: String!
    description: String
    createdAt: String!
  }

  type SparkCategoriesData {
    data: [SparkCategory]
    meta: Meta
  }

  input SparkCategoryFilter {
    name: String
    description: String
  }

  input SparkCategoryInput {
    name: String!
    description: String
  }

  type Query {
    sparkCategories(filter: SparkCategoryFilter, pagination: Pagination): SparkCategoriesData!
    sparkCategory(id: ID!): SparkCategory!
  }

  type Mutation {
    createSparkCategory(input: SparkCategoryInput!): SparkCategory!
    updateSparkCategory(id: ID!, input: SparkCategoryInput!): SparkCategory!
    deleteSparkCategory(id: ID!): SparkCategory!
  }
`;

export default sparkCategoryTypeDefs;
