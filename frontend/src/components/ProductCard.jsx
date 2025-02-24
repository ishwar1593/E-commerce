import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSearch } from "../context/SearchContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const apiUrl = "http://localhost:8000/api/v1";
function ProductCard() {
  const { searchQuery } = useSearch();
  const { productId } = useSearch();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data from the API
  useEffect(() => {
    async function fetchProducts() {
      try {
        if (!searchQuery) {
          const response = await axios.get(
            `${apiUrl}/product?page=${currentPage}&pageSize=10`
          );
          if (response.data.success) {
            console.log("Products:", response.data.data);

            setProducts(response.data.data);

            setTotalPages(response.data.pagination.totalPages);

            // Initialize quantities from localStorage (if any)
            const savedQuantities =
              JSON.parse(localStorage.getItem("cartQuantities")) || [];
            const initialQuantities = response.data.data.map(
              (_, index) => savedQuantities[index] || 1
            );
            setQuantities(initialQuantities);
            setLoading(false);
          } else {
            setError("Failed to load products.");
          }
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError("Error fetching data.");
      }
    }

    fetchProducts();
  }, [currentPage, searchQuery]);

  // Search use effect
  useEffect(() => {
    const fetchProductsById = async () => {
      if (!productId) return; // If searchQuery is empty, don't do anything
      setLoading(true);

      try {
        console.log("Products :", productId);

        const response = await axios.get(`${apiUrl}/product/${productId}`, {
          withCredentials: true,
        });
        console.log("Product by ID:", response.data.product);
        // const temp = (response.data.product);

        if (response.data.success) {
          setLoading(false);
          setProducts([response.data.product]); // Set the product if found
          setTotalPages(1);
        } else {
          setError("Product not found.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductsById();
  }, [productId]);

  if (!products) return <div>No product found for this query.</div>;

  // Handle Quantity Change
  const handleQuantityChange = (index, action) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      const currentQuantity = newQuantities[index] || 1;
      let newQuantity = currentQuantity;

      if (action === "increment") {
        newQuantity = currentQuantity + 1;
      } else if (action === "decrement" && currentQuantity > 1) {
        newQuantity = currentQuantity - 1;
      }

      newQuantities[index] = newQuantity;
      // Save the updated quantities to localStorage
      localStorage.setItem("cartQuantities", JSON.stringify(newQuantities));

      return newQuantities;
    });
  };

  // Call Cart API to add product to the cart
  const addToCart = async (productId, quantity) => {
    // window.location.reload();
    try {
      await axios.post(
        `${apiUrl}/cart/add-cart`,
        {
          productId,
          quantity,
        },
        {
          withCredentials: true,
        }
      );

      // alert("Product added to cart");
      window.location.reload();
      toast.success("Product added to cart");
    } catch (error) {
      if (error.status === 401) {
        navigate("/signin"); // Redirect to signin page if there's an error
        toast.error("Please sign in to add products to cart");
      } else {
        toast.error("Failed to add product to cart");
        console.error("Failed to add product to cart:", error);
      }
    }
  };

  // Pagination Buttons
  const renderPagination = () => {
    const pageNumbers = [];
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > 5) {
      if (currentPage > 3) {
        pageNumbers.push(1, "...");
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i >= 1 && i <= totalPages) {
        pageNumbers.push(i);
      }
    }

    return (
      <div className="flex justify-center space-x-4 mt-4">
        {pageNumbers.map((page, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded-md border ${
              page === currentPage
                ? "bg-primary text-white"
                : "bg-white text-primary"
            }`}
            onClick={() => page !== "..." && setCurrentPage(Number(page))}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  console.log("products", products);
  return (
    <div className="mt-8 px-4 sm:px-8 lg:px-16 mx-auto">
      <div className="grid gap-4 sm:grid-cols-2 sm:mx-[25px] md:grid-cols-3 md:mx-[50px] lg:grid-cols-4 place-items-center lg:mx-[200px]">
        {products.map((product, index) => (
          <Card key={product.id} className="w-full max-w-xs rounded-xl border">
            <div className="grid gap-4 p-4">
              <div className="aspect-[3/2] w-full overflow-hidden rounded-xl">
                <img
                  src={product.images[0]} // Show the first image
                  alt={product.name}
                  width="400"
                  height="500"
                  className="aspect-[3/2] object-cover border w-full"
                />
              </div>
              <div className="grid gap-1.5">
                <h3 className="font-semibold text-sm md:text-base">
                  {product.name}
                </h3>
                <div className="flex gap-2">
                  <p className="font-semibold text-sm md:text-base">
                    ₹{product.sales_price}
                  </p>
                  <p className="font-semibold text-sm md:text-base line-through text-gray-600">
                    ₹{product.mrp}
                  </p>
                </div>
                <p className="text-sm md:text-base text-gray-800">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 mt-2">
                <Button
                  size="sm"
                  onClick={() => handleQuantityChange(index, "decrement")}
                >
                  -
                </Button>
                <span className="text-sm md:text-base">
                  {quantities[index] || 1}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleQuantityChange(index, "increment")}
                >
                  +
                </Button>
              </div>
              <Button
                size="sm"
                className="mt-4"
                onClick={() => addToCart(product.id, quantities[index])} // Call API when "Add to cart" is clicked
              >
                Add to cart
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && renderPagination()}
    </div>
  );
}

export default ProductCard;
