"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type NoteDeFrais = {
  id: number;
  titre: string;
  statut: "CREEE" | "VALIDEE" | "REFUSEE" | "TRAITEE";
  dateSoumission: string;
  commentaire: string;
  fichiers: string; // JSON.stringify([...])
  user?: {
    email: string;
    role: string;
  };
};

export default function ListeNoteFrais() {
  const [notes, setNotes] = useState<NoteDeFrais[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteDeFrais | null>(null);
  const [role, setRole] = useState<string>("");
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [errorAction, setErrorAction] = useState<string>("");

  useEffect(() => {
    async function fetchNotes() {
      try {
        const token = Cookies.get("authToken");
        const res = await fetch("http://localhost:3000/api/users/list-note-frais", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setNotes(data.note_de_frais || []);
          setRole(data.role || "");
        } else {
          console.error("Erreur :", data.error);
        }
      } catch (err) {
        console.error("Erreur fetch :", err);
      }
    }
    fetchNotes();
  }, []);

  // --- Appel PATCH pour changer le statut ---
  const updateStatut = async (id: number, newStatut: NoteDeFrais["statut"]) => {
    setLoadingAction(true);
    setErrorAction("");
    try {
      const token = Cookies.get("authToken");
      const res = await fetch("http://localhost:3000/api/users/update-note-statut", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ noteId:id, statut: newStatut }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorAction(data?.error || "Échec de la mise à jour");
        return;
      }

      // Mettre à jour la note dans la liste localement
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, statut: data.note?.statut ?? newStatut } : n))
      );
      // Mettre à jour aussi la modale si ouverte
      setSelectedNote((prev) => (prev ? { ...prev, statut: data.note?.statut ?? newStatut } : prev));
    } catch (e) {
      setErrorAction("Erreur réseau");
    } finally {
      setLoadingAction(false);
    }
  };

  // --- Boutons visibles selon rôle + statut ---
  const renderActionsForRole = (note: NoteDeFrais) => {
    // Manager : agit une fois sur CREEE -> VALIDEE ou REFUSEE
    if (role === "MANAGER" && note.statut === "CREEE") {
      return (
        <div className="flex gap-2">
          <button
            disabled={loadingAction}
            onClick={() => updateStatut(note.id, "VALIDEE")}
            className="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            Valider
          </button>
          <button
            disabled={loadingAction}
            onClick={() => updateStatut(note.id, "REFUSEE")}
            className="px-3 py-2 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
          >
            Refuser
          </button>
        </div>
      );
    }

    // Comptabilité : agit une fois sur VALIDEE -> TRAITEE
    if (role === "COMPTABILITE" && note.statut === "VALIDEE") {
      return (
        <button
          disabled={loadingAction}
          onClick={() => updateStatut(note.id, "TRAITEE")}
          className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          Marquer comme traitée
        </button>
      );
    }

    // Sinon pas d'action possible
    return <span className="text-gray-400">—</span>;
  };

  return (
    <div className="p-6">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des notes de frais</h1>
        {role && <span className="text-sm text-gray-600">Rôle : {role}</span>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow-sm rounded">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="p-3 text-left">Titre</th>
              {["MANAGER", "COMPTABILITE"].includes(role) && (
                <th className="p-3 text-left">Email</th>
              )}
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Date de soumission</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{note.titre}</td>
                {["MANAGER", "COMPTABILITE"].includes(role) && (
                  <td className="p-3">{note.user?.email || "—"}</td>
                )}
                <td className="p-3">{note.statut}</td>
                <td className="p-3">
                  {new Date(note.dateSoumission).toLocaleDateString("fr-FR")}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedNote(note)}
                      className="text-blue-600 hover:underline"
                    >
                      Voir
                    </button>
                    {/* Actions rapides dans le tableau */}
                    {renderActionsForRole(note)}
                  </div>
                </td>
              </tr>
            ))}
            {notes.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Aucune note à afficher.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modale des détails */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Détails de la note</h2>
            <p>
              <strong>Titre :</strong> {selectedNote.titre}
            </p>
            <p>
              <strong>Statut :</strong> {selectedNote.statut}
            </p>
            <p>
              <strong>Date :</strong>{" "}
              {new Date(selectedNote.dateSoumission).toLocaleDateString("fr-FR")}
            </p>
            <p>
              <strong>Commentaire :</strong> {selectedNote.commentaire}
            </p>

            <div className="mt-4">
              <p className="font-medium">Pièces justificatives :</p>
              <ul className="list-disc list-inside">
                {JSON.parse(selectedNote.fichiers).map((file: string, i: number) => (
                  <li key={i}>
                    <a
                      href={`http://localhost:3000${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {file.split("/").pop()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions dans la modale */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-rose-600 h-5">
                {errorAction ? errorAction : null}
              </div>
              <div className="flex gap-2">
                {renderActionsForRole(selectedNote)}
                <button
                  onClick={() => setSelectedNote(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
