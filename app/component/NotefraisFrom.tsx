"use client"
import React, { useState } from "react";
import Cookies from "js-cookie";


const NotefraisFrom = () => {
    const [titre, setTitre] = useState("");
    const [commentaire, setCommentaire] = useState("");
    const [fichiers, setFichiers] = useState<File[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const expirationInSeconds = 5;
    const expirationInDays = expirationInSeconds / 86400;
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        
    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("commentaire", commentaire);
    
    
    if (fichiers) {
        for ( let i = 0; i < fichiers.length; i++) {
            formData.append("fichiers", fichiers[i]);
        }
    }

    try {
        console.log("Token (cookie) =>", Cookies.get("authToken"));

        const token = Cookies.get("authToken");

        const res = await fetch("http://localhost:3000/api/users/note-frais", {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`, // si tu utilises un token
              },
            body: formData,
          });
    
          const data = await res.json();

    
          if (res.ok) {

            Cookies.set("FromLogin", "vrai", {
              expires: expirationInDays,
              secure: false,
            });
            window.location.href = "/home";
          } else {
            setErrorMessage(data.error || "Une erreur est survenue");
          }
    } catch (error) {
        setErrorMessage("Une erreur est survenue lors de la soumission de la note de frais");
    }
    };

    return (
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md border space-y-4"
        >
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Créer une note de frais</h2>
    
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
    
          <div>
            <label className="block text-sm font-medium mb-1">Commentaire</label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
    
          <div>
            <label className="block text-sm font-medium mb-1">Fichiers justificatifs</label>
            <input
              type="file"
              multiple
              onChange={(e) => setFichiers(e.target.files ? Array.from(e.target.files) : [])}
              className="w-full"
            />
          </div>
    
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
          >
            Soumettre
          </button>
    
          {errorMessage && <p className="text-sm mt-4">{errorMessage}</p>}
        </form>
      );
};

export default NotefraisFrom;

