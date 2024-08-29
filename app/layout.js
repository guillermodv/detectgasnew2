"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserContext } from "./context/userContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [userSession, setUserSession] = useState({username: "", password: ""});
  const user = { userSession, setUserSession };

  const router = useRouter();
  
  useEffect(() => {
    if (!userSession || userSession.password === '') {
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
