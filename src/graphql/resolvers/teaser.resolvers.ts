// // ./src/graphql/typeDefs/teaser.ts

import Spark from "../../models/spark.model.js";
import Teaser from "../../models/teaser.model.js";
import { generateTeasers } from "../../services/teaser.services.js";

const teaserResolvers = {
  Query: {
    teasers: async (parent, args, context, info) => {
      try {
        const pagination = args.pagination || {};
        const filters = args.filter || {};
        let { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const userId = context?.user?.data?.id;
        if (!userId) {
          throw new Error("Unauthorized");
        }

        // find the teasers that are associated with the user's sparks
        const sparks = await Spark.find({ user: userId });
        const spark = { spark: { $in: sparks.map((s) => s._id) } };

        const constructedFilters = {
          ...(filters.content && {
            content: { $regex: filters.content, $options: "i" },
          }),
          ...(filters.spark ? { spark: filters.spark } : spark),
          ...(filters.scheduledDate && {
            scheduledDate: filters.scheduledDate,
          }),
          ...(filters.sent && { sent: filters.sent }),
        };

        const teasers = await Teaser.find(constructedFilters)
          .skip(skip)
          .limit(limit)
          .populate("spark");

        const count = await Teaser.countDocuments(constructedFilters);

        const pages = Math.ceil(count / limit);

        return {
          data: teasers,
          meta: {
            page,
            limit,
            pages,
            total: count,
          },
        };
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ teasers err:", error);
        throw new Error(error);
      }
    },
    teaser: async (parent, args, context, info) => {
      try {
        const userId = context?.user?.data?.id;
        if (!userId) {
          throw new Error("Unauthorized");
        }

        const teaser = await Teaser.findById(args.id).populate("spark");

        if (!teaser) {
          throw new Error("Teaser not found");
        }

        return teaser;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ teaser err:", error);
        throw new Error(error);
      }
    },
  },
  Teaser: {
    spark: async (parent, args, context, info) => {
      try {
        const sparkId = parent.spark;
        const spark = await Spark.findById(sparkId);

        if (!spark) {
          throw new Error("Spark not found");
        }

        return spark;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ spark err:", error);
        throw new Error(error);
      }
    },
  },
  Mutation: {
    generateTeasers: async (parent, args, context, info) => {
      try {
        const userId = context?.user?.data?.id;
        if (!userId) {
          throw new Error("Unauthorized");
        }

        const input = args.input || {};

        const { sparkId, numTeasers = 2, description = "", style = "" } = input;

        const teasers = await generateTeasers(
          sparkId,
          numTeasers,
          description,
          style
        );

        return teasers;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ generateTeasers err:", error);
        throw new Error(error);
      }
    },
    createTeaser: async (parent, args, context, info) => {
      try {
        const userId = context?.user?.data?.id;
        if (!userId) {
          throw new Error("Unauthorized");
        }

        const { content, spark, scheduledDate } = args.input;

        const newTeaser = new Teaser({
          content,
          spark,
          scheduledDate,
        });

        const savedTeaser = await newTeaser.save();

        return savedTeaser;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ createTeaser err:", error);
        throw new Error(error);
      }
    },
    updateTeaser: async (parent, args, context, info) => {
      try {
        const userId = context?.user?.data?.id;
        if (!userId) {
          throw new Error("Unauthorized");
        }

        const { id, input } = args;

        const updatedTeaser = await Teaser.findByIdAndUpdate(id, input, {
          new: true,
        });

        return updatedTeaser;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ updateTeaser err:", error);
        throw new Error(error);
      }
    },
    deleteTeaser: async (parent, args, context, info) => {
      try {
        const userId = context?.user?.data?.id;
        if (!userId) {
          throw new Error("Unauthorized");
        }

        const deletedTeaser = await Teaser.findByIdAndDelete(args.id);

        return deletedTeaser;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ deleteTeaser err:", error);
        throw new Error(error);
      }
    },
  },
};

export default teaserResolvers;
