"use client";

import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import Barrelayout from "../component/Barrelayout";

export default function NoteLayout() {
  const router = useRouter();

  const cards = [
    {
      title: "Nouvelle note de frais",
      description:
        "Ajoutez une dépense en quelques clics avec justificatif et commentaires.",
      redirect: "/notefrais",
    },
    {
      title: "Consulter mes notes",
      description:
        "Visualisez l'historique de vos notes de frais et suivez leur statut.",
      redirect: "/mesnotes",
    },
  ];

  return (
    <Barrelayout>
      <div className="min-h-screen bg-gray-50 p-10">
        <h1 className="text-3xl font-bold text-center mb-10">Gestion des notes de frais</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-xl transition cursor-pointer group"
              onClick={() => router.push(card.redirect)}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600">
                    {card.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="mt-6 flex justify-end">
                  <PlusCircle className="text-blue-500 group-hover:scale-110 transition-transform" size={28} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Barrelayout>
  );
}
