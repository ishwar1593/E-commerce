import prisma from "../../db/connectDB.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../../utils/cloudinary.utils.js";

const searchProduct = async (req, res) => {
  const query = req.query.q;
  const isNumericQuery = !isNaN(query) && !isNaN(parseFloat(query));

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query, // Search in the `name` field
              mode: "insensitive", // Case-insensitive search
            },
          },
          isNumericQuery && {
            ws_code: {
              equals: parseInt(query, 10), // Exact match for ws_code if the query is numeric
            },
          },
        ].filter(Boolean), // Remove any undefined elements in the OR array
      },
    });

    return res.status(200).json({ data: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    // Step 1: Get data from the request body
    const {
      name,
      description,
      category,
      package_size,
      tags,
      sales_price,
      mrp,
      stockQty,
    } = req.body;
    const productPhotosLocalPath = req.files;

    // Step 2: Validation
    if (
      !name ||
      !description ||
      !category ||
      !package_size ||
      !tags ||
      !sales_price ||
      !mrp ||
      !stockQty
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Step 3: Handle images (if applicable)
    if (!productPhotosLocalPath && productPhotosLocalPath.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Product images required." });
    }

    // Step 4: Upload images on cloudinary
    const productPhotos = productPhotosLocalPath.map((file) => {
      return uploadOnCloudinary(file.path);
    });

    // Step 5 : Wait for all promises to resolve.
    const cloudinaryUploadResults = await Promise.all(productPhotos);

    if (
      !cloudinaryUploadResults ||
      cloudinaryUploadResults.some((result) => !result)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Error while adding images..." });
    }

    // Step 6: Create the product in the database

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        category,
        package_size: parseInt(package_size),
        tags: Array.isArray(tags)
          ? tags
          : tags.split(",").map((tag) => tag.trim()), // Convert array to JSON if tags is an array
        sales_price: parseFloat(sales_price), // Ensure it's stored as a number
        mrp: parseFloat(mrp),
        stockQty: parseInt(stockQty),
        images: cloudinaryUploadResults.map((result) => result.secure_url),
        user: {
          connect: { id: req.user.id }, // Correct way to associate a user by ID
        },
      },
    });

    // Step 5: Respond with the newly created product
    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    // Step 1: Get data from the request body
    const {
      name,
      description,
      category,
      ws_code,
      package_size,
      tags,
      sales_price,
      mrp,
      stockQty,
    } = req.body;
    const productPhotosLocalPath = req.files; // If images are updated, handle them

    // Step 2: Validation (ensure required fields are provided except `ws_code` since it's immutable)
    if (
      !name ||
      !description ||
      !category ||
      !ws_code ||
      !package_size ||
      !tags ||
      !sales_price ||
      !mrp ||
      !stockQty
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Step 3: Check if the product exists
    const product = await prisma.product.findUnique({
      where: {
        ws_code: parseInt(ws_code), // `ws_code` will be passed as a parameter
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ws_code ${ws_code} not found.`,
      });
    }

    // Step 4: Handle images (if applicable)
    let cloudinaryUploadResults = [];
    if (productPhotosLocalPath && productPhotosLocalPath.length > 0) {
      const productPhotos = productPhotosLocalPath.map((file) =>
        uploadOnCloudinary(file.path)
      );

      // Wait for all image uploads to finish
      cloudinaryUploadResults = await Promise.all(productPhotos);

      if (
        !cloudinaryUploadResults ||
        cloudinaryUploadResults.some((result) => !result)
      ) {
        return res.status(400).json({
          success: false,
          message: "Error while updating images...",
        });
      }
    }

    // Step 5: Update product in the database (excluding ws_code which is immutable)
    const updatedProduct = await prisma.product.update({
      where: {
        ws_code: parseInt(ws_code), // `ws_code` used to find the product
      },
      data: {
        name,
        description,
        category,
        package_size: parseInt(package_size),
        tags: Array.isArray(tags)
          ? tags
          : tags.split(",").map((tag) => tag.trim()), // Convert array to JSON if tags is a string
        sales_price: parseFloat(sales_price),
        mrp: parseFloat(mrp),
        stockQty: parseInt(stockQty),
        images:
          cloudinaryUploadResults.length > 0
            ? cloudinaryUploadResults.map((result) => result.secure_url) // Only update images if new ones are provided
            : product.images, // Keep the existing images if no new images are provided
        user: {
          connect: { id: req.user.id },
        },
      },
    });

    // Step 6: Respond with the updated product
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { ws_code } = req.params; // Get ws_code from the URL params

    // Step 1: Check if the product exists
    const product = await prisma.product.findUnique({
      where: {
        ws_code: parseInt(ws_code), // Use ws_code to find the product
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ws_code ${ws_code} not found.`,
      });
    }

    // Step 2: Delete images from Cloudinary (if there are any)
    if (product.images && product.images.length > 0) {
      const deleteImagePromises = product.images.map((imageUrl) =>
        deleteFromCloudinary(imageUrl)
      );
      await Promise.all(deleteImagePromises); // Wait for all image deletions
    }

    // Step 3: Delete the product from the database
    await prisma.product.delete({
      where: {
        ws_code: parseInt(ws_code), // Use ws_code to identify the product
      },
    });

    // Step 4: Respond with a success message
    return res.status(200).json({
      success: true,
      message: `Product with ws_code ${ws_code} has been deleted successfully.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the product",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the URL params

    // Step 1: Find the product by ID
    const product = await prisma.product.findUnique({
      where: {
        id: id, // Find the product using the ID
      },
    });

    // Step 2: If product is not found, return a 404 error
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    // Step 3: Return the found product data
    return res.status(200).json({
      success: true,
      message: "Product found successfully",
      product: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the product",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    // Step 1: Get query parameters for pagination
    const { page = 1, pageSize = 10 } = req.query;

    // Convert page and pageSize to integers
    let pageNumber = parseInt(page);
    let pageSizeNumber = parseInt(pageSize);

    // Step 2: Validation to make sure page and pageSize are positive numbers
    if (pageNumber <= 0 || pageSizeNumber <= 0) {
      pageNumber = 1;
      pageSizeNumber = 10;
    }

    // Step 3: Calculate the 'skip' and 'take' values for pagination
    const skip = (pageNumber - 1) * pageSizeNumber; // Skip previous pages
    const take = pageSizeNumber; // Number of products to return

    // Step 4: Fetch the paginated products from the database
    const products = await prisma.product.findMany({
      skip, // Skip the first n records
      take, // Take the next n records
    });

    // Step 5: Get the total count of products for pagination info
    const totalProducts = await prisma.product.count();

    // Step 6: Send the response with paginated products and pagination info
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      pagination: {
        currentPage: pageNumber,
        pageSize: pageSizeNumber,
        totalProducts,
        totalPages: Math.ceil(totalProducts / pageSizeNumber),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching products",
      error: error.message,
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    // Step 1: Get query parameters for pagination and category
    const { category, page = 1, pageSize = 10 } = req.query;

    // Step 2: Validation for category and pagination values
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }

    const pageNumber = parseInt(page);
    const pageSizeNumber = parseInt(pageSize);

    // Step 3: Validation to make sure page and pageSize are positive numbers
    if (pageNumber <= 0 || pageSizeNumber <= 0) {
      pageNumber = 1;
      pageSizeNumber = 10;
    }

    // Step 4: Calculate the 'skip' and 'take' values for pagination
    const skip = (pageNumber - 1) * pageSizeNumber; // Skip previous pages
    const take = pageSizeNumber; // Number of products to return

    // Step 5: Fetch the paginated products by category from the database
    const products = await prisma.product.findMany({
      where: {
        category: category, // Filter products by category
      },
      skip, // Skip the first n records
      take, // Take the next n records
    });

    // Step 6: Get the total count of products for pagination info
    const totalProducts = await prisma.product.count({
      where: {
        category: category, // Count products by category
      },
    });

    // Step 7: Send the response with paginated products and pagination info
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      pagination: {
        currentPage: pageNumber,
        pageSize: pageSizeNumber,
        totalProducts,
        totalPages: Math.ceil(totalProducts / pageSizeNumber),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching products by category",
      error: error.message,
    });
  }
};

export {
  searchProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  getProductsByCategory,
};
