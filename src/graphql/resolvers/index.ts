import ApiKeyResolvers from "./apiKey.resolvers.js";
import googleAuthResolvers from "./google.auth.resolvers.js";
import OTPResolvers from "./otp.resolvers.js";
import passwordResetResolvers from "./passwordReset.resolvers.js";
import roleResolvers from "./role.resolvers.js";
import sparkResolvers from "./spark.resolvers.js";
import sparkCategoriesResolvers from "./sparkCategories.resolvers.js";
import teaserResolvers from "./teaser.resolvers.js";
import userResolvers from "./user.resolvers.js";

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...roleResolvers.Query,
    ...OTPResolvers.Query,
    ...ApiKeyResolvers.Query,
    ...sparkResolvers.Query,
    ...teaserResolvers.Query,
    ...sparkCategoriesResolvers.Query,
  },
  Spark: {
    ...sparkResolvers.Spark,
  },
  Teaser: {
    ...teaserResolvers.Teaser,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...roleResolvers.Mutation,
    ...OTPResolvers.Mutation,
    ...ApiKeyResolvers.Mutation,
    ...googleAuthResolvers.Mutation,
    ...passwordResetResolvers.Mutation,
    ...sparkResolvers.Mutation,
    ...teaserResolvers.Mutation,
    ...sparkCategoriesResolvers.Mutation,
  },
};

export default resolvers;
