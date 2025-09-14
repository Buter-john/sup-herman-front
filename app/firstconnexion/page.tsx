"use client";

import { useState } from "react";
import Cookies from "js-cookie";

export default function FirstConnexion() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/users/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("authToken")}`, // ✅ token
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        Cookies.set("authToken", data.token, { expires: 7, secure: false });
        window.location.href = "/home"; // après changement => home
      } else {
        setError(data.error || "Erreur");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-lg font-bold text-black mb-4">Changer votre mot de passe</h1>
        <input 
          type="password"
          placeholder="Mot de passe actuel"
          className="w-full mb-3 p-2 border rounded text-black"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input 
          type="password"
          placeholder="Nouveau mot de passe"
          className="w-full mb-3 p-2 border rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Valider
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
