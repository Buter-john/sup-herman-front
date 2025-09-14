// import Link from "next/link";

// export default function Barrelayout ({ children }:{ children: React.ReactNode }) {
//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Top navbar */}
//       <header className="flex items-center justify-between px-6 py-4 border-b border-gray-300 shadow-sm">
//         <h1 className="text-xl font-semibold">SUP HERMAN</h1>
//         <nav className="flex gap-4">
//           <Link href="/profil" className="text-black hover:underline">
//             Mon profil
//           </Link>
//           <Link href="/login" className="text-black hover:underline">
//             Déconnexion
//           </Link>
//           <Link href="/create_user" className="text-black hover:underline">
//             Créer un utilisateur
//           </Link>
//         </nav>
//       </header>

//       {/* Page content */}
//       <main className="flex-grow bg-gray-50 p-6">{children}</main>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type ApiResponse = { role?: string; user?: { role?: string } };
type UserState = { role: string } | null;

export default function Barrelayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserState>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("authToken");
        console.log("cookie authToken =", token);
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:3000/api/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // si ton back utilise cookie httpOnly à la place du header, utilise plutôt:
          // credentials: "include"
        });

        if (!res.ok) {
          // debug : affiche le body pour comprendre pourquoi (401, 403, etc.)
          const text = await res.text();
          console.warn("/api/users/me non ok:", res.status, text);
          setUser(null);
          setLoading(false);
          return;
        }

        const data: ApiResponse = await res.json();
        console.log("/api/users/me data:", data);

        // Normalisation : accepte les deux formats { role } ou { user: { role } }
        const rawRole = data?.user?.role ?? data?.role ?? "";
        const role = typeof rawRole === "string" ? rawRole.trim().toLowerCase() : "";

        if (role) {
          setUser({ role }); // stocke en minuscule pour comparaisons sûres
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Erreur fetch /me:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isManager = user?.role === "manager";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-300 shadow-sm">
        <h1 className="text-xl font-semibold">SUP HERMAN</h1>
        <nav className="flex gap-4">
          <Link href="/profil" className="text-black hover:underline">Mon profil</Link>
          <Link href="/login" className="text-black hover:underline">Déconnexion</Link>

          {/* n'affiche le lien QUE si on a vérifié et que c'est bien un manager */}
          {!loading && isManager && (
            <Link href="/create_user" className="text-black hover:underline">
              Créer un utilisateur
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-grow bg-gray-50 p-6">{children}</main>
    </div>
  );
}
