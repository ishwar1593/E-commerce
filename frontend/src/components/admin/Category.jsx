import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";

const apiUrl = "http://localhost:8000/api/v1";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/category`, {
        withCredentials: true,
      });
      console.log(response.data);

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create or update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        // Update existing category
        const response = await axios.patch(
          `${apiUrl}/admin/category/update-category/${editingId}`,
          {
            name: categoryName,
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success("Category updated successfully");
        }
      } else {
        // Create new category
        const response = await axios.post(
          `${apiUrl}/admin/category/create-category`,
          {
            name: categoryName,
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success("Category created successfully");
        }
      }

      // Refresh categories
      fetchCategories();
      setCategoryName("");
      setIsOpen(false);
      setEditingId(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (editingId
            ? "Failed to update category"
            : "Failed to create category")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      const response = await axios.delete(
        `${apiUrl}/admin/category/delete-category/${id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setCategoryName(category.name);
    setIsOpen(true);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Category Management</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setCategoryName("");
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Category Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : editingId ? "Update" : "Add"}{" "}
                Category
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-mono text-sm">
                  {category.id}
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredCategories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  {searchQuery
                    ? "No categories found matching your search"
                    : "No categories found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;
