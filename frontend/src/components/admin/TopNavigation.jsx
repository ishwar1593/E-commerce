import React from "react";
import {  LogOut } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const apiUrl = "http://localhost:8000/api/v1";
const TopNavigation = () => {
  // Handle logout
  const handleLogout = async () => {
    try {
      // Call backend to invalidate the session or delete the token
      await axios.post(`${apiUrl}/user/logout`, {}, { withCredentials: true });

      // clear local storage
      localStorage.removeItem("cartQuantities");

      // Update frontend state
      window.location.href = "/signin"; // Redirect to sign-in page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-4 gap-4">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="outline"
            className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white font-bold"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
          <Avatar>
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
