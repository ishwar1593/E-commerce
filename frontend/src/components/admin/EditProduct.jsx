import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";

const EditProduct = ({
    editFormData,
    setEditFormData,
    handleUpdateProduct,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-4">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              name="name"
              value={editFormData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">MRP</label>
            <Input
              name="mrp"
              type="number"
              value={editFormData.mrp}
              onChange={handleChange}
              placeholder="Enter MRP"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Sales Price
            </label>
            <Input
              name="sales_price"
              type="number"
              value={editFormData.sales_price}
              onChange={handleChange}
              placeholder="Enter sales price"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Stock Qty</label>
            <Input
              name="stockQty"
              type="number"
              value={editFormData.stockQty}
              onChange={handleChange}
              placeholder="Enter stock quantity"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select
              name="category_id"
              value={editFormData.category_id}
              onChange={(value) =>
                setEditFormData((prev) => ({ ...prev, category_id: value }))
              }
            >
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              name="status"
              value={editFormData.status}
              onChange={(value) =>
                setEditFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </Select>
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={()=>{handleUpdateProduct(editFormData.id)}}>Update Product</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
