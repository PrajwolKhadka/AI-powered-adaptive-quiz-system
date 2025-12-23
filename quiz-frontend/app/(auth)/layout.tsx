import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">

      <header className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="MyLogo"
            width={120}
            height={32}
            priority
          />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>

      <footer className="h-14 flex items-center justify-center border-t text-sm text-gray-500">
        © {new Date().getFullYear()} Maanak -AI Powered Adaptive Quiz System. All rights reserved.
      </footer>

    </div>
  );
}
