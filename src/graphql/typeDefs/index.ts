import apiKeyTypeDefs from "./apiKey.js";
import googleAuthTypeDefs from "./google.auth.js";
import otpTypeDefs from "./otp.js";
import passwordResetTypeDefs from "./passwordReset.js";
import roleTypeDefs from "./role.js";
import sparkTypeDefs from "./spark.js";
import sparkCategoryTypeDefs from "./sparkCategory.js";
import teaserTypeDefs from "./teaser.js";
import userTypeDefs from "./user.js";

const globalTypeDefs = `#graphql
  scalar JSON

  input Pagination {
    page: Int
    limit: Int
  }

  type Meta {
    page: Int
    limit: Int
    pages: Int
    total: Int
  }
`;

const typeDefs = `
  ${globalTypeDefs}
  ${userTypeDefs}
  ${roleTypeDefs}
  ${otpTypeDefs}
  ${apiKeyTypeDefs}
  ${googleAuthTypeDefs}
  ${passwordResetTypeDefs}
  ${sparkTypeDefs}
  ${sparkCategoryTypeDefs}
  ${teaserTypeDefs}
`;

export default typeDefs;
