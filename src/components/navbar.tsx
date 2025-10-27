"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuContent, 
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import Logout from "./logout";

export default function Navigation() {
  async function signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
  }
  return (
    <>
      <div className="px-16 pt-6 flex justify-between items-center w-full ">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="text-2xl font-bold">
                <Link href="/">STL Athletics</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

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
                <NavigationMenuTrigger>Records</NavigationMenuTrigger>
                <NavigationMenuContent className="p-1 shadow-md rounded-lg">
                  <ul className="grid">
                    <li>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link href="/finances">Finances</Link>
                      </NavigationMenuLink>
                    </li>

                    <li>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link href="/finances">Finances</Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
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
      <div className="px-16 pt-6 flex justify-between items-center w-full border-b"></div>
    </>
  );
}
