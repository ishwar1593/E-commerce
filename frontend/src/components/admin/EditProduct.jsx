import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify"; // Assuming you use this for notifications

const apiUrl = "http://localhost:8000/api/v1";

const EditProduct = ({ setIsEditModalOpen, productId, selectedProduct,fetchProducts }) => {
  const [categories, setCategories] = useState([]); // State to store categories
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: selectedProduct.name,
    description: selectedProduct.description,
    category: selectedProduct.category,
    package_size: selectedProduct.package_size,
    tags: selectedProduct.tags,
    sales_price: selectedProduct.sales_price,
    mrp: selectedProduct.mrp,
    stockQty: selectedProduct.stockQty,
    photos: [],
  });

  // Fetch categories from server when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/category`, {
          withCredentials: true,
        }); // Assuming your API has an endpoint for categories

        setCategories(response.data.data); // Set the categories to state
      } catch (err) {
        toast.error("Failed to fetch categories.");
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, photos: files });

    // Preview the images
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };
  const handleSubmit = async (productId) => {
    console.log(formData);
    
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category.name); // Ensure the field name is correct
    formDataToSend.append("package_size", formData.package_size);
    formDataToSend.append("tags", formData.tags);
    formDataToSend.append("sales_price", formData.sales_price);
    formDataToSend.append("mrp", formData.mrp);
    formDataToSend.append("stockQty", formData.stockQty);

    formData.photos.forEach((file) => {
      formDataToSend.append("photos", file);
    });

    console.log("Form Data:", formDataToSend); // Log the form data to check

    try {
      const response = await axios.put(
        `${apiUrl}/product/updateProduct/${productId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("Response:", response.data);

      toast("Product updated successfully!");
      setIsEditModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error("Failed to update product.");
      console.error("Error updating product:", err.response?.data || err);
    }
  };

  return (
    <div className="p-6 space-y-6 h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold">Add New Product</h2>

      <div>
        <label>Name</label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
        />
      </div>

      <div>
        <label>Description</label>
        <Input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Product Description"
        />
      </div>

      <div>
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="" disabled>
            Select a Category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Package Size</label>
        <Input
          type="text"
          name="package_size"
          value={formData.package_size}
          onChange={handleChange}
          placeholder="Package Size"
        />
      </div>

      <div>
        <label>Tags</label>
        <Input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
        />
      </div>

      <div>
        <label>Sales Price</label>
        <Input
          type="text"
          name="sales_price"
          value={formData.sales_price}
          onChange={handleChange}
          placeholder="Sales Price"
        />
      </div>

      <div>
        <label>MRP</label>
        <Input
          type="text"
          name="mrp"
          value={formData.mrp}
          onChange={handleChange}
          placeholder="MRP"
        />
      </div>

      <div>
        <label>Stock Quantity</label>
        <Input
          type="number"
          name="stockQty"
          value={formData.stockQty}
          onChange={handleChange}
          placeholder="Stock Quantity"
        />
      </div>

      <div>
        <label>Product Photos</label>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <div className="mt-4 flex gap-4">
          {imagePreviews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-24 h-24 object-cover rounded-md"
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Button onClick={() => handleSubmit(productId)}>Save Changes</Button>
      </div>
    </div>
  );
};

export default EditProduct;
