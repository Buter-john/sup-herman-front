"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import AlertMessage from "./AlerteMessage";


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const expirationInSeconds = 5;
  const expirationInDays = expirationInSeconds / 86400;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

   


    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        Cookies.set("authToken", data.token, { expires: 7, secure: false });

        if (data.firstLogin){
          window.location.href = "/firstconnexion";
        } else {
          window.location.href = "/home";
        }
      } else {
        setErrorMessage(data.error || "Une erreur est survenue");
      }

      console.log(data);

    } catch (error) {
      console.error("Erreur réseau :", error);
      setErrorMessage("Connexion impossible au serveur.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="mb-6 text-center">
          <div className="text-2xl text-black mb-1"> Sup-herman 🔱</div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="name@email.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-black"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-black"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
          >
            Sign in
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4">
            <AlertMessage
              title="Erreur lors de la connexion !"
              error={errorMessage}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginForm;
