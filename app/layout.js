"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserContext } from "./context/userContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [userSession, setUserSession] = useState({username: "", password: ""});
  const user = { userSession, setUserSession };
  const pathname = usePathname()

  const router = useRouter();
  
  useEffect(() => {
    console.log(pathname);
    if (!userSession || userSession.username === '' && pathname !== "/login" && pathname !== "/recovery" && pathname !== "/login2" && pathname !== "/register" && pathname !== "/register2" && pathname !== "/perfil" && pathname !== "/dashboard" && pathname !== "/historicoSensor") {
      router.push('/login')
    }
  }, [userSession])

  return (
    <UserContext.Provider value={user}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </UserContext.Provider>
  );
}
