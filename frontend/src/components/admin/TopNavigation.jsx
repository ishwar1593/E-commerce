import React from "react";
import {
  BellIcon,
  Settings,
  Users,
  Package,
  Search,
  PlusCircle,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TopNavigation = () => {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-4 gap-4">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline" size="icon">
            <BellIcon className="h-4 w-4" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              {/* Settings content */}
            </SheetContent>
          </Sheet>
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
