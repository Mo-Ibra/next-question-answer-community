import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Navbar from "@/components/navbar";

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto mt-20 text-center text-muted-foreground">
          User not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">
          {user.name || "Unnamed User"}
        </h1>

        <div className="space-y-6">
          {user.image && (
            <div>
              <Image
                src={user.image}
                alt={user.name || "User Image"}
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          {/* ID */}
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-mono text-sm">{user.id}</p>
          </div>

          {/* Created At */}
          <div>
            <p className="text-sm text-muted-foreground">Joined</p>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
