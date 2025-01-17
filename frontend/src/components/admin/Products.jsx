import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Modal from "./Modal";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import { set } from "react-hook-form";

const apiUrl = "http://localhost:8000/api/v1";
const Products = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // Set page size
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productId, setProductId] = useState("");
  const [editFormData, setEditFormData] = useState({
    name: "",
    mrp: "",
    sales_price: "",
    stockQty: "",
    category_id: "",
    status: "",
  });

  const closeAddProductModal = () => {
    setIsAddModalOpen(false);
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(currentPage);
    // fetchCategories();
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm) {
      console.log("Search term", searchTerm);

      searchProducts();
    } else {
      fetchProducts();
    }
  }, [searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/category`, {
        withCredentials: true,
      });
      console.log(("Category response", response.data));

      setCategories(response.data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${apiUrl}/product?page=${page}&pageSize=10`,
        {
          withCredentials: true,
        }
      );
      console.log("Product response", response.data);

      setProducts(response.data.data || []);
      setTotalPages(response.data.pagination.totalPages || 1);
      // console.log("Total pages", response.data.pagination.totalPages);

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch products");
      setLoading(false);
      console.error("Error fetching products:", err);
    }
  };

  // Define the handlePageChange function
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // Ensure valid page range
    setCurrentPage(page); // Set the new current page
    fetchProducts(page); // Fetch products for the new page
  };

  const searchProducts = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/product/search?q=${searchTerm}`,
        { withCredentials: true }
      );
      console.log("Search response", response.data.data);

      setProducts(response.data.data || []);
    } catch (err) {
      console.error("Error searching products:", err);
    }
  };

  const handleViewProduct = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/product/${id}`, {
        withCredentials: true,
      });
      console.log("View response", response.data.product);
      setSelectedProduct(response.data.product); // Set the product details
      setIsViewModalOpen(true); // Open the modal
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch product details",
        variant: "destructive",
      });
      console.error("Error fetching product details:", err);
    }
  };

  const fetchProductById = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/product/${id}`, {
        withCredentials: true,
      });
      console.log("Edit response", response.data.product);
      setSelectedProduct(response.data.product); // Set the product details
      setIsEditModalOpen(true); // Open the modal
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch product details",
        variant: "destructive",
      });
      console.error("Error fetching product details:", err);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product); // Set selected product to be edited
    setProductId(product.id); // Set the product ID
    setIsEditModalOpen(true); // Open the modal
  };

  const handleUpdateProduct = async (id) => {
    try {
      await axios.put(`${apiUrl}/product/updateProduct/${id}`, editFormData, {
        withCredentials: true,
      });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      setIsEditModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };
  const handleDeleteProduct = async (ws_code) => {
    try {
      // Send the delete request to the server
      await axios.delete(`${apiUrl}/product/deleteProduct/${ws_code}`, {
        withCredentials: true,
      });

      // Update the products list by removing the deleted product from the state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.ws_code !== ws_code)
      );

      // Display a success toast
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      // Close the delete modal
      setIsDeleteModalOpen(false);
    } catch (err) {
      // Display an error toast in case of failure
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>

      {/* The Modal */}
      <Modal isOpen={isAddModalOpen} onClose={closeAddProductModal}>
        <AddProduct
          setIsAddModalOpen={setIsAddModalOpen}
          fetchProducts={fetchProducts}
        />
      </Modal>

      {/* Search and Filter Section */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button> */}
      </div>

      {/* Products Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>MRP</TableHead>
                <TableHead>Sales Price</TableHead>
                <TableHead>Stock</TableHead>
                {/* <TableHead>Status</TableHead> */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images && product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          WS Code: {product.ws_code}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {product.category?.name || "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{product.mrp}</TableCell>
                  <TableCell>₹{product.sales_price}</TableCell>
                  <TableCell>
                    <Badge className={
                        product.stockQty > 10 ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }
                      variant={
                        product.stockQty > 10 ? "success" : "destructive"
                      }
                    >
                      {product.stockQty || 0} in stock
                    </Badge>
                  </TableCell>
                  {/* <TableCell>
                    <Badge
                      variant={
                        product.status === "ACTIVE" ? "success" : "secondary"
                      }
                    >
                      {product.status || "ACTIVE"}
                    </Badge>
                  </TableCell> */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            handleEditProduct(product);
                          }}
                        >
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewProduct(product.id)}
                        >
                          View Details
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>Update Stock</DropdownMenuItem> */}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteProduct(product.ws_code)}
                        >
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Product detail modal */}
      {isViewModalOpen && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            {selectedProduct ? (
              <div className="text-lg grid grid-template-columns-2">
                <div className="flex gap-2 justify-center mb-4">
                  {selectedProduct.images.map((img, index) => (
                    <img
                      key={index} // Provide a unique key for each element in the array
                      src={img}
                      alt={selectedProduct.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
                <p>
                  <strong>Name:</strong> {selectedProduct.name}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedProduct.description || "N/A"}
                </p>
                <p>
                  <strong>MRP:</strong> ₹{selectedProduct.mrp}
                </p>
                <p>
                  <strong>Sales Price:</strong> ₹{selectedProduct.sales_price}
                </p>
                <p>
                  <strong>Stock Quantity:</strong> {selectedProduct.stockQty}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {selectedProduct.category.name || "Uncategorized"}
                </p>
                {/* <p>
                  <strong>Status:</strong> {selectedProduct.status}
                </p> */}
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedProduct.created_at).toLocaleString()}
                </p>
              </div>
            ) : (
              <p>Loading product details...</p>
            )}
          </div>
        </Modal>
      )}

      {/* Edit Product modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <EditProduct
            setIsEditModalOpen={setIsEditModalOpen}
            productId={productId} // Pass productId to the EditProduct component
            selectedProduct={selectedProduct}
            fetchProducts={fetchProducts}
          />
        </Modal>
      )}

      {/* Delete Product modal */}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "outline"}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "bg-black text-white" : ""}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Products;
