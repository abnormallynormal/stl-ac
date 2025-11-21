"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import Logout from "./logout";
import { ChevronDown } from "lucide-react";

export default function Navigation() {
  async function signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
  }
  return (
    <>
      <div className="px-16 pt-4 flex justify-between items-center w-full">
        <div className="flex items-center h-16">
          <Link href="/" className="text-2xl font-bold">
            STL Athletics
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="flex flex-row">
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/teams">Teams</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className={navigationMenuTriggerStyle()}>
                    Records <ChevronDown className="ml-2 h-3 w-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="p-2">
                    <DropdownMenuItem asChild>
                      <Link href="/finances">Finances</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/points">Points</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/yearbook">Yearbook</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/highlights">Highlights</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/awards">MVPs/LCAs</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/students">Students</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/sports">Sports</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/emails">Email</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <ModeToggle />
          <Logout />
        </div>
      </div>
    </>
  );
}
