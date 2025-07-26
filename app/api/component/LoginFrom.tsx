// "use client";

// import React, { useState } from "react";
// import Cookies from "js-cookie";
// import AlertMessage from "../component/AlerteMessage";

// const LoginForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const expirationInSeconds = 5;
//   const expirationInDays = expirationInSeconds / 86400; // Convertir en jours

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMessage("");
//     const formData = new FormData();
//     formData.append("email", email);
//     formData.append("password", password);
//     try {
//       const res = await fetch("http://localhost:3000/api/users/login", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (res.ok) {
//         console.log("Connexion réussie");
//         Cookies.set("authToken", data.token, { expires: 7, secure: false });
//         Cookies.set("FromLogin", "vrai", {
//           expires: expirationInDays,
//           secure: false,
//         });
//         window.location.href = "/home";
//       } else {
//         setErrorMessage(data.error || "Une erreur est survenue");
//       }
//     } catch (error) {
//       console.error("Erreur réseau :", error);
//     }
//   };

//   return (
//     <div className="login-form-container">
//       <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
//         <div className="relative z-0 w-full mb-5 group">
//           <input
//             type="email"
//             name="floating_email"
//             id="floating_email"
//             className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//             placeholder=" "
//             required
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <label
//             htmlFor="floating_email"
//             className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//           >
//             Email
//           </label>
//         </div>
//         <div className="relative z-0 w-full mb-5 group">
//           <input
//             type="password"
//             name="floating_password"
//             id="floating_password"
//             className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//             placeholder=" "
//             required
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <label
//             htmlFor="floating_password"
//             className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//           >
//             Mot de passe
//           </label>
//         </div>

//         <p className="text-center text-sm text-gray-600">
//           Pas encore de compte ?{" "}
//           <span
//             onClick={() => (window.location.href = "/register")}
//             className="text-blue-600 hover:underline cursor-pointer"
//           >
//             S'inscrire maintenant
//           </span>
//         </p>

//         <div className="flex justify-center mt-4">
//           <button
//             type="submit"
//             className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//           >
//             Se connecter
//           </button>
//         </div>
//       </form>

//       {errorMessage && (
//         <AlertMessage
//           title="Erreur lors de l'inscription !"
//           error={errorMessage}
//         />
//       )}
//     </div>
//   );
// };

// export default LoginForm;

"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import AlertMessage from "../component/AlerteMessage";
import Link from "next/link";

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
        Cookies.set("FromLogin", "vrai", {
          expires: expirationInDays,
          secure: false,
        });
        window.location.href = "/api/home";
      } else {
        setErrorMessage(data.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setErrorMessage("Connexion impossible au serveur.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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
