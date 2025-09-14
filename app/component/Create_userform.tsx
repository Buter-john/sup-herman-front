"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employe");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Nouvel utilisateur créé avec succès !");
        setEmail("");
        setPassword("");
        setRole("Employe");

        // Redirection après 2 sec vers le menu manager
        setTimeout(() => {
          router.push("/manager/menu");
        }, 2000);
      } else {
        setMessage("❌ Erreur : " + (data.error || "Impossible de créer"));
      }
    } catch (err) {
      setMessage("Erreur réseau.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Créer un nouvel utilisateur</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe temporaire"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="Employe">Employé</option>
          <option value="Manager">Manager</option>
          <option value="Comptabilite">Comptabilité</option>
        </select>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Créer
        </button>
      </form>

      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
}
