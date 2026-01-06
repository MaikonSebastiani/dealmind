import { auth } from "@/lib/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="font-bold text-xl">DEALMIND</div>

      <div className="flex items-center gap-4">
        {session?.user && (
          <>
            <span className="text-sm text-muted-foreground">
              {session.user.email}
            </span>
          </>
        )}
      </div>
    </header>
  );
}