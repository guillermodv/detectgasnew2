"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserContext } from "./context/userContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [userSession, setUserSession] = useState({ username: "", email: "" });
  const user = { userSession, setUserSession };
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Intentar cargar el usuario desde localStorage al iniciar el componente
    const storedUser = localStorage.getItem("userWordle");
    if (storedUser) {
      setUserSession(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    console.log(pathname);
    // Si el usuario no está logueado y la ruta no es alguna de las permitidas, redirigir al login
    if (
      (!userSession || userSession.username === "") &&
      pathname !== "/login" &&
      pathname !== "/recovery" &&
      pathname !== "/login2" &&
      pathname !== "/register" &&
      pathname !== "/register2" &&
      pathname !== "/perfil" &&
      pathname !== "/dashboard" &&
      pathname !== "/historicoSensor"
    ) {
      router.push("/login");
    }
  }, [userSession, pathname]); // Añadir pathname como dependencia

  return (
    <UserContext.Provider value={user}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </UserContext.Provider>
  );
}
