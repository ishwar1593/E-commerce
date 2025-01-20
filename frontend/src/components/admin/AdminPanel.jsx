import React, { useState } from "react";
import {
  BellIcon,
  Settings,
  Users,
  Package,
  Search,
  PlusCircle,
  MoreHorizontal,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import TopNavigation from "./TopNavigation";
import OrderPanel from "./OrdersPanel";
import Products from "./Products";
import Category from "./Category";

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      description: "+20.1% from last month",
    },
    {
      title: "Active Users",
      value: "2,350",
      description: "+180.1% from last month",
    },
    {
      title: "Products",
      value: "12,234",
      description: "+19% from last month",
    },
  ];

  // Navigation items configuration
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Package },
  ];

  const renderMainContent = () => {
    switch (activeSection) {
      case 'orders':
        return <OrderPanel />;
      case 'products':
        return <Products />;
      case 'categories':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Categories Management</h2>
            <Category />
          </div>
        );
      default:
        return (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderPanel limit={5} /> {/* Show limited orders on dashboard */}
              </CardContent>
            </Card>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/90">
      {/* Top Navigation */}
      <TopNavigation />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;