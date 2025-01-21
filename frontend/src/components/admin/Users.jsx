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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";

const apiUrl = "http://localhost:8000/api/v1";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admin/users`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle role update
  const handleRoleChange = async (userId, newRole) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `${apiUrl}/admin/user/updateRole`,
        { userId, role: newRole },
        { withCredentials: true }
      );
      console.log(response.data);

      if (response.data.success) {
        // Update local state with the new role
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        toast.success(`User role updated to ${newRole}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update user role"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await axios.delete(`${apiUrl}/admin/user/delete/${id}`, {
        withCredentials: true,
      });
      console.log(response.data);

      if (response.data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  // Edit user (open dialog)
  const handleEdit = (user) => {
    setEditingUser(user);
    setIsOpen(true);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Input
            placeholder="Search users..."
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
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-sm">{user.id}</TableCell>
                <TableCell>
                  {user.fname} {user.lname}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full">{user.role}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {user.role === "USER" && (
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(user.id, "ADMIN")}
                        >
                          Make Admin
                        </DropdownMenuItem>
                      )}
                      {user.role === "ADMIN" && (
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(user.id, "USER")}
                        >
                          Revert to User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-right">
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(user)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button> */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  {searchQuery
                    ? "No users found matching your search"
                    : "No users found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
