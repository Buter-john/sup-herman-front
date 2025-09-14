"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type Profil = {
  id: number;
  email: string;
  role: string;
  prenom?: string;
  nom?: string;
};

const  ProfilFrom = () => {

  const [profil, setProfil] = useState<Profil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfil() {
      try {
        const token = Cookies.get("authToken");
        const res = await fetch("http://localhost:3000/api/users/profil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Impossible de charger le profil");
        } else {
          setProfil(data.user); // ⚠️ adapte selon ce que ton backend renvoie
        }
      } catch (err) {
        setError("Erreur serveur");
      } finally {
        setLoading(false);
      }
    }

    fetchProfil();
  }, []);

  if (loading) return <p className="p-6">Chargement...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-black mb-4">Mon profil</h1>
      {profil && (
        <div className="space-y-2 text-black">
          <p><strong>Email :</strong> {profil.email}</p>
          <p><strong>Rôle :</strong> {profil.role}</p>
        </div>
      )}
    </div>
  );
}

export default ProfilFrom ;