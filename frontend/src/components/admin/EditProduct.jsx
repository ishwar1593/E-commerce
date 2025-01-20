// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "react-toastify"; // Assuming you use this for notifications

// const apiUrl = "http://localhost:8000/api/v1";

// const EditProduct = ({
//   setIsEditModalOpen,
//   productId,
//   selectedProduct,
//   fetchProducts,
// }) => {
//   const [categories, setCategories] = useState([]); // State to store categories
//   const [imagePreviews, setImagePreviews] = useState(
//     selectedProduct.images || []
//   );

//   const [formData, setFormData] = useState({
//     name: selectedProduct.name,
//     description: selectedProduct.description,
//     category: selectedProduct.category,
//     package_size: selectedProduct.package_size,
//     tags: selectedProduct.tags,
//     sales_price: selectedProduct.sales_price,
//     mrp: selectedProduct.mrp,
//     stockQty: selectedProduct.stockQty,
//     photos: selectedProduct.images,
//   });

//   // Fetch categories from server when component mounts
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(`${apiUrl}/category`, {
//           withCredentials: true,
//         }); // Assuming your API has an endpoint for categories

//         setCategories(response.data.data); // Set the categories to state
//       } catch (err) {
//         toast.error("Failed to fetch categories.");
//         console.error("Error fetching categories:", err);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const updatedPhotos = [...formData.photos, ...files]; // Append new images to existing ones

//     // Update both the preview and the form data
//     const previews = files.map((file) => URL.createObjectURL(file));
//     setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);

//     // Update the form data
//     setFormData({ ...formData, photos: updatedPhotos });
//   };

//   // Function to remove an image preview
//   const handleRemoveImage = (index) => {
//     const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
//     const updatedPhotos = formData.photos.filter((_, i) => i !== index);

//     setImagePreviews(updatedPreviews);
//     setFormData({ ...formData, photos: updatedPhotos });
//   };

//   const handleSubmit = async (productId) => {
//     console.log(formData);

//     const formDataToSend = new FormData();
//     formDataToSend.append("name", formData.name);
//     formDataToSend.append("description", formData.description);
//     formDataToSend.append("category", formData.category.name); // Ensure the field name is correct
//     formDataToSend.append("package_size", formData.package_size);
//     formDataToSend.append("tags", formData.tags);
//     formDataToSend.append("sales_price", formData.sales_price);
//     formDataToSend.append("mrp", formData.mrp);
//     formDataToSend.append("stockQty", formData.stockQty);

//     formData.photos.forEach((file) => {
//       formDataToSend.append("photos", file);
//     });

//     console.log("Form Data:", formDataToSend); // Log the form data to check

//     try {
//       const response = await axios.put(
//         `${apiUrl}/product/updateProduct/${productId}`,
//         formDataToSend,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           withCredentials: true,
//         }
//       );
//       console.log("Response:", response.data);

//       toast("Product updated successfully!");
//       setIsEditModalOpen(false);
//       fetchProducts();
//     } catch (err) {
//       toast.error("Failed to update product.");
//       console.error("Error updating product:", err.response?.data || err);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6 h-[80vh] overflow-y-auto">
//       <h2 className="text-2xl font-bold">Update Product</h2>

//       <div>
//         <label>Name</label>
//         <Input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="Product Name"
//         />
//       </div>

//       <div>
//         <label>Description</label>
//         <Input
//           type="text"
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           placeholder="Product Description"
//         />
//       </div>

//       <div>
//         <label>Category</label>
//         <select
//           name="category"
//           value={formData.category}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-md"
//         >
//           <option value="" disabled>
//             Select a Category
//           </option>
//           {categories.map((category) => (
//             <option key={category.id} value={category.name}>
//               {category.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label>Package Size</label>
//         <Input
//           type="text"
//           name="package_size"
//           value={formData.package_size}
//           onChange={handleChange}
//           placeholder="Package Size"
//         />
//       </div>

//       <div>
//         <label>Tags</label>
//         <Input
//           type="text"
//           name="tags"
//           value={formData.tags}
//           onChange={handleChange}
//           placeholder="Tags (comma separated)"
//         />
//       </div>

//       <div>
//         <label>Sales Price</label>
//         <Input
//           type="text"
//           name="sales_price"
//           value={formData.sales_price}
//           onChange={handleChange}
//           placeholder="Sales Price"
//         />
//       </div>

//       <div>
//         <label>MRP</label>
//         <Input
//           type="text"
//           name="mrp"
//           value={formData.mrp}
//           onChange={handleChange}
//           placeholder="MRP"
//         />
//       </div>

//       <div>
//         <label>Stock Quantity</label>
//         <Input
//           type="number"
//           name="stockQty"
//           value={formData.stockQty}
//           onChange={handleChange}
//           placeholder="Stock Quantity"
//         />
//       </div>

//       <div>
//         <label>Product Photos</label>
//         <Input
//           type="file"
//           accept="image/*"
//           multiple
//           onChange={handleImageChange}
//         />
//         <div className="mt-4 flex gap-4">
//           {imagePreviews.map((preview, index) => (
//             <div key={index} className="relative">
//               <img
//                 key={index}
//                 src={preview}
//                 alt={`Preview ${index + 1}`}
//                 className="w-24 h-24 object-cover rounded-md"
//               />
//               <Button
//                 onClick={() => handleRemoveImage(index)}
//                 className="absolute top-0 right-0 bg-primary text-white rounded-full "
//               >
//                 X
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-4">
//         <Button onClick={() => handleSubmit(productId)}>Save Changes</Button>
//       </div>
//     </div>
//   );
// };

// export default EditProduct;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

const apiUrl = "http://localhost:8000/api/v1";

const EditProduct = ({
  setIsEditModalOpen,
  productId,
  selectedProduct,
  fetchProducts,
}) => {
  const [categories, setCategories] = useState([]);

  // Track existing images and new files separately
  const [existingImages, setExistingImages] = useState(
    selectedProduct.images || []
  );
  const [newImageFiles, setNewImageFiles] = useState([]);

  const [formData, setFormData] = useState({
    name: selectedProduct.name,
    description: selectedProduct.description,
    category: selectedProduct.category.name,
    package_size: selectedProduct.package_size,
    tags: selectedProduct.tags,
    sales_price: selectedProduct.sales_price,
    mrp: selectedProduct.mrp,
    stockQty: selectedProduct.stockQty,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/category`, {
          withCredentials: true,
        });
        setCategories(response.data.data);
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
    setNewImageFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setNewImageFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (productId) => {
    const formDataToSend = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      // Handle tags specially since they might need to be joined
      if (key === "tags" && Array.isArray(formData[key])) {
        formDataToSend.append(key, formData[key].join(","));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append existing images - they'll be handled by the controller
    formDataToSend.append("images", JSON.stringify(existingImages));

    // Append new files if any
    newImageFiles.forEach((file) => {
      formDataToSend.append("photos", file);
    });

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

      toast.success("Product updated successfully!");
      setIsEditModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error("Failed to update product.");
      console.error("Error updating product:", err.response?.data || err);
    }
  };

  return (
    <div className="p-6 space-y-6 h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold">Update Product</h2>

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
          value={
            Array.isArray(formData.tags)
              ? formData.tags.join(", ")
              : formData.tags
          }
          onChange={handleChange}
          placeholder="Tags (comma separated)"
        />
      </div>

      <div>
        <label>Sales Price</label>
        <Input
          type="number"
          name="sales_price"
          value={formData.sales_price}
          onChange={handleChange}
          placeholder="Sales Price"
        />
      </div>

      <div>
        <label>MRP</label>
        <Input
          type="number"
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

        {/* Existing Images */}
        <div className="mt-4">
          <h3 className="font-medium mb-2">Existing Images:</h3>
          <div className="flex gap-4">
            {existingImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <Button
                  onClick={() => handleRemoveExistingImage(index)}
                  className="absolute top-0 right-0 bg-primary text-white rounded-full"
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* New Images Preview */}
        {newImageFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">New Images:</h3>
            <div className="flex gap-4">
              {newImageFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <Button
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-0 right-0 bg-primary text-white rounded-full"
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Button onClick={() => handleSubmit(productId)}>Save Changes</Button>
      </div>
    </div>
  );
};

export default EditProduct;
