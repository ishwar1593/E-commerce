import prisma from "../../db/connectDB.js";

const createCategory = async (req, res) => {
  try {
    // Extracting data from the request body
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    // Check if the category name already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name, isdeleted: false },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists.",
      });
    }

    // Create the new category
    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the category.",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  const { categoryId } = req.params; // Category ID from the route parameter

  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: "Category ID is required",
    });
  }

  try {
    // Check if the category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId, isdeleted: false },
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Delete the category
    await prisma.category.update({
      where: { id: categoryId },
      data: { isdeleted: true },
    });

    return res.json({
      success: true,
      message: `${category.name} Category deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  const { categoryId } = req.params; // Category ID from the route parameter
  const { name } = req.body; // New category name from the request body

  if (!categoryId || !name) {
    return res.status(400).json({
      success: false,
      message: "Category ID and name are required",
    });
  }

  try {
    // Check if the category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId, isdeleted: false },
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Check if the new name already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name, isdeleted: false },
    });

    if (existingCategory && existingCategory.id !== categoryId) {
      return res.status(400).json({
        success: false,
        message: "A category with this name already exists.",
      });
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId, isdeleted: false },
      data: { name },
    });

    return res.json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export { createCategory, deleteCategory, updateCategory };
