import SparkCategory from "../../models/sparkCategory.model.js";

const sparkCategoriesResolvers = {
  Query: {
    sparkCategories: async (parent, args, context, info) => {
      try {
        const pagination = args.pagination || {};
        const filters = args.filter || {};
        let { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const userId = context?.user?.data?.id;

        if (!userId) {
          throw new Error("Unauthorized");
        }

        const constructedFilters = {
          ...(filters.name && {
            name: { $regex: filters.name, $options: "i" },
          }),
          ...(filters.description && {
            description: { $regex: filters.description, $options: "i" },
          }),
        };

        const sparkCategories = await SparkCategory.find(constructedFilters)
          .skip(skip)
          .limit(limit);

        const count = await SparkCategory.countDocuments(constructedFilters);

        const pages = Math.ceil(count / limit);

        return {
          data: sparkCategories,
          meta: {
            page,
            limit,
            pages,
            total: count,
          },
        };
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ sparkCategories err:", error);
        throw new Error(error);
      }
    },
    sparkCategory: async (parent, args, context, info) => {
      try {
        const id = args.id;
        const userId = context?.user?.data?.id;

        if (!userId) {
          throw new Error("Unauthorized");
        }

        const sparkCategory = await SparkCategory.findById(id);

        if (!sparkCategory) {
          throw new Error("Spark category not found");
        }

        return sparkCategory;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ sparkCategory err:", error);
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createSparkCategory: async (parent, args, context, info) => {
      try {
        const userId = context?.user?.data?.id;
        if (!userId) {
          throw new Error("Unauthorized");
        }

        const { name, description } = args.input;

        const sparkCategory = new SparkCategory({
          name,
          description,
        });

        await sparkCategory.save();

        return sparkCategory;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ createSparkCategory err:", error);
        throw new Error(error);
      }
    },
    updateSparkCategory: async (parent, args, context, info) => {
      try {
        const userId = context?.user?.data?.id;
        if (!userId) {
          throw new Error("Unauthorized");
        }

        const id = args.id;
        const { name, description } = args.input;

        const sparkCategory = await SparkCategory.findById(id);

        if (!sparkCategory) {
          throw new Error("Spark category not found");
        }

        sparkCategory.name = name;
        sparkCategory.description = description;

        await sparkCategory.save();

        return sparkCategory;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ updateSparkCategory err:", error);
        throw new Error(error);
      }
    },
    deleteSparkCategory: async (parent, args, context, info) => {
      try {
        const userId = context?.user?.data?.id;
        if (!userId) {
          throw new Error("Unauthorized");
        }

        const id = args.id;

        const sparkCategory = await SparkCategory.findByIdAndDelete(id);

        return sparkCategory;
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ deleteSparkCategory err:", error);
        throw new Error(error);
      }
    },
  },
};

export default sparkCategoriesResolvers;
