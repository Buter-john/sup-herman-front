import Link from "next/link";

export default function Barrelayout ({ children }:{ children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-300 shadow-sm">
        <h1 className="text-xl font-semibold">SUP HERMAN</h1>
        <nav className="flex gap-4">
          <Link href="/profil" className="text-black hover:underline">
            Mon profil
          </Link>
          <Link href="/login" className="text-black hover:underline">
            Déconnexion
          </Link>
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-grow bg-gray-50 p-6">{children}</main>
    </div>
  );
}
