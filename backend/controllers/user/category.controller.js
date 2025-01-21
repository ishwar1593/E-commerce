import prisma from "../../db/connectDB.js";

const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await prisma.category.findMany({
      where: {
        isdeleted: false,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found.",
      });
    }

    return res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: "Category ID is required",
    });
  }

  try {
    // Fetch the category by ID
    const category = await prisma.category.findUnique({
      where: { id: categoryId, isdeleted: false },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export { getAllCategories, getCategoryById };
