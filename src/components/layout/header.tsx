import { auth, signOut } from "@/lib/auth";
import { HeaderClient } from "./header-client";

export async function Header() {
  const session = await auth();

  return (
    <header 
      className="flex h-16 items-center justify-between border-b bg-background px-6"
      role="banner"
    >
      <div className="font-bold text-xl tracking-tight text-primary">
        <span className="sr-only">DealMind - </span>
        DEALMIND
      </div>

      <div className="flex items-center gap-4">
        <HeaderClient userEmail={session?.user?.email} />
        
        {session?.user && (
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              aria-label="Sign out of your account"
            >
              Logout
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
