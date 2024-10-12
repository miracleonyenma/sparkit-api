import Role from "../../models/role.model.js";
import Spark from "../../models/spark.model.js";
import SparkCategory from "../../models/sparkCategory.model.js";
import User from "../../models/user.model.js";
import {
  sendSparkSubscriptionMail,
  sendSparkUnsubscriptionMail,
} from "../../services/spark.services.js";

const sparkResolvers = {
  Query: {
    sparks: async (parent, args, context, info) => {
      try {
        const pagination = args.pagination || {};
        const filters = args.filter || {};
        let { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const userId = context?.user?.data?.id;

        if (!userId) {
          throw new Error("Unauthorized");
        }

        // check if user has admin role
        const user = await User.findById(userId).populate("roles");
        const roles = await Role.find({ _id: { $in: user.roles } });

        const isAdmin = roles.some((role) => role.name === "admin");

        const constructedFilters = {
          creator: userId,
          ...(filters.title && {
            title: { $regex: filters.title, $options: "i" },
          }),
          ...(filters.fileType && { fileType: filters.fileType }),
          ...(filters.creator && isAdmin && { creator: filters.creator }),
          ...(filters.launchDate && { launchDate: filters.launchDate }),
          ...(filters.isLaunched && { isLaunched: filters.isLaunched }),
        };

        const sparks = await Spark.find(constructedFilters)
          .skip(skip)
          .limit(limit)
          .populate("creator")
          .populate("subscribers");

        const count = await Spark.countDocuments(constructedFilters);
        const pages = Math.ceil(count / limit);

        console.log({
          data: sparks,
        });

        return {
          data: sparks,
          meta: {
            page,
            limit,
            pages,
            total: count,
          },
        };
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ sparks err:", error);
        throw new Error(error);
      }
    },
    allSparks: async (parent, args, context, info) => {
      try {
        const pagination = args.pagination || {};
        const filters = args.filter || {};
        let { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const constructedFilters = {
          ...(filters.title && {
            title: { $regex: filters.title, $options: "i" },
          }),
          ...(filters.fileType && { fileType: filters.fileType }),
          ...(filters.creator && { creator: filters.creator }),
          ...(filters.launchDate && { launchDate: filters.launchDate }),
          ...(filters.isLaunched && { isLaunched: filters.isLaunched }),
        };

        const sparks = await Spark.find(constructedFilters)
          .skip(skip)
          .limit(limit)
          .populate("creator")
          .populate("subscribers");

        const count = await Spark.countDocuments(constructedFilters);
        const pages = Math.ceil(count / limit);

        return {
          data: sparks,
          meta: {
            page,
            limit,
            pages,
            total: count,
          },
        };
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ allSparks err:", error);
        throw new Error(error);
      }
    },
    spark: async (parent, args, context, info) => {
      try {
        const id = args.id;
        const userId = context?.user?.data?.id;

        if (!userId) {
          throw new Error("Unauthorized");
        }

        return await Spark.findById(id)
          .populate("creator")
          .populate("subscribers");
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ spark err:", error);
        throw new Error(error);
      }
    },
  },
  Spark: {
    creator: async (parent, args, context, info) => {
      try {
        const userId = parent.creator;
        if (!userId) {
          throw new Error("Creator not found");
        }

        const user = await User.findById(userId).populate("roles");

        return user;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ creator err:", error);
        throw new Error(error);
      }
    },
    subscribers: async (parent, args, context, info) => {
      try {
        const userIds = parent.subscribers;
        if (!userIds) {
          throw new Error("Subscribers not found");
        }

        const users = await User.find({ _id: { $in: userIds } }).populate(
          "roles"
        );

        return users;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ subscribers err:", error);
        throw new Error(error);
      }
    },
    category: async (parent, args, context, info) => {
      try {
        const categoryId = parent.category;
        if (!categoryId) {
          throw new Error("Category not found");
        }

        return await SparkCategory.findById(categoryId);
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ category err:", error);
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createSpark: async (parent, args, context, info) => {
      try {
        const userId = context?.user?.data?.id;

        if (!userId) {
          throw new Error("Unauthorized");
        }

        const input = args.input;

        // find spark with same title
        const existingSpark = await Spark.findOne({ title: input.title });

        if (existingSpark) {
          throw new Error("Spark with same title already exists");
        }

        const spark = await await Spark.create({
          ...input,
          creator: userId,
        });

        console.log(
          "🚀 ~ file: spark.resolvers.ts ~ line 100 ~ createSpark ~ spark",
          spark
        );

        return spark;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ createSpark err:", error);
        throw new Error(error);
      }
    },
    updateSpark: async (parent, args, context, info) => {
      try {
        const userId = context?.user?.data?.id;

        if (!userId) {
          throw new Error("Unauthorized");
        }

        const id = args.id;
        const input = args.input;

        const spark = await Spark.findByIdAndUpdate(id, input, {
          new: true,
        });

        return spark;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ updateSpark err:", error);
        throw new Error(error);
      }
    },
    deleteSpark: async (parent, args, context, info) => {
      try {
        const userId = context?.user?.data?.id;

        if (!userId) {
          throw new Error("Unauthorized");
        }

        const id = args.id;

        const spark = await Spark.findByIdAndDelete(id);

        return spark;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ deleteSpark err:", error);
        throw new Error(error);
      }
    },
    subscribeToSpark: async (parent, args, context, info) => {
      try {
        const id = args.id;
        const userId = context?.user?.data?.id;

        if (!userId) {
          throw new Error("Unauthorized");
        }

        const user = await User.findById(userId);

        // check if user is already subscribed
        const spark = await Spark.findById(id);

        if (spark.subscribers.includes(userId)) {
          throw new Error("User is already subscribed");
        }

        await await Spark.findByIdAndUpdate(
          id,
          { $addToSet: { subscribers: userId } },
          { new: true }
        );

        console.log({ spark });

        sendSparkSubscriptionMail(user.email, spark.title);

        return spark;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ subscribeToSpark err:", error);
        throw new Error(error);
      }
    },
    unsubscribeFromSpark: async (parent, args, context, info) => {
      try {
        const id = args.id;
        const userId = context?.user?.data?.id;

        if (!userId) {
          throw new Error("Unauthorized");
        }

        const user = await User.findById(userId);

        const spark = await Spark.findByIdAndUpdate(
          id,
          { $pull: { subscribers: userId } },
          { new: true }
        );

        await sendSparkUnsubscriptionMail(user.email, spark.title);

        return await spark;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ unsubscribeFromSpark err:", error);
        throw new Error(error);
      }
    },
  },
};

export default sparkResolvers;
