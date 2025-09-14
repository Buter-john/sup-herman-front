"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";

const CreateUserForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYE"); // valeur par défaut
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Création d'un vrai FormData
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
    

      const token = Cookies.get("authToken")
      const response = await fetch("http://localhost:3000/api/users/create", {
        method: "POST",
        body: formData, 
         headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création");
      }

      const data = await response.json();
      setMessage(`✅ Utilisateur créé : ${data.email} (${data.role})`);

      // Reset du form
      setEmail("");
      setPassword("");
      setRole("EMPLOYE");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 shadow rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Créer un utilisateur</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Mot de passe</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Rôle</label>
          <select
            className="w-full border p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="EMPLOYE">EMPLOYE</option>
            <option value="MANAGER">MANAGER</option>
            <option value="COMPTABILITE">COMPTABILITE</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Créer
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default CreateUserForm;
