import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EmailVerified from "@/components/dashboard/email-verified";
import Image from "next/image";
import Navbar from "@/components/navbar";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      emailVerified: true,
      followers: true,
      following: true,
    },
  });

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id },
    select: { provider: true },
  });

  if (!user?.emailVerified && !account?.provider) {
    return <EmailVerified session={session} />;
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Main Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome</CardTitle>
              <CardDescription>
                You're logged in and viewing your protected dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.user.image && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Image:</p>
                  <Image
                    src={session.user.image}
                    alt="Image"
                    width="100"
                    height="100"
                  />
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Name:</p>
                <p className="font-medium">{session.user.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Email:</p>
                <p className="font-medium">{session.user.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">User ID:</p>
                <p className="font-mono text-sm">{session.user.id}</p>
              </div>
              {user?.emailVerified && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Email Verified:
                  </p>
                  <p className="text-green-600 font-medium">✓ Verified</p>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Followers / Following */}
          <Card>
            <CardHeader>
              <CardTitle>Social Stats</CardTitle>
              <CardDescription>
                Your social activity on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-10 text-center">
              {/* Followers */}
              <div>
                <p className="text-3xl font-bold">{user?.followers.length}</p>
                <p className="text-muted-foreground">Followers</p>
              </div>

              {/* Following */}
              <div>
                <p className="text-3xl font-bold">{user?.following.length}</p>
                <p className="text-muted-foreground">Following</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
