import SparkCategory from "../models/sparkCategory.model.js";

const seedCategories = async () => {
  const categories = [
    { name: "Technology", description: "All things tech, from gadgets to AI." },
    { name: "Creative Arts", description: "Music, art, writing, and more." },
    {
      name: "Business & Finance",
      description: "Entrepreneurship, investing, and markets.",
    },
    {
      name: "Education & Self-Improvement",
      description: "Learning, growth, and development.",
    },
    {
      name: "Entertainment & Pop Culture",
      description: "Movies, games, and pop culture.",
    },
    {
      name: "Health & Fitness",
      description: "Physical and mental health topics.",
    },
    {
      name: "Science & Nature",
      description: "Everything from biology to environmental issues.",
    },
    {
      name: "Travel & Lifestyle",
      description: "Travel, food, and living experiences.",
    },
    {
      name: "Social Causes",
      description: "Activism, charity, and social justice.",
    },
    {
      name: "Miscellaneous",
      description: "Anything that doesn't fit elsewhere.",
    },
  ];

  try {
    for (const category of categories) {
      const exists = await SparkCategory.findOne({ name: category.name });
      if (!exists) {
        await SparkCategory.create(category);
        console.log(`Category "${category.name}" added.`);
      }
    }
    console.log("Categories seeded successfully.");
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
};

export { seedCategories };
