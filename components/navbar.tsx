// components/navbar.tsx
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/dashboard/user-nav";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          MyApp
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">
                  Dashboard
                </Button>
              </Link>

              <UserNav user={session.user} />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="default" size="sm">
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button variant="outline" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
