import Image from "next/image";
import { useRouter } from "next/navigation"; // Importar useRouter
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function Header() {
  const user = useContext(UserContext);
  const { setUserSession, userSession } = user;
  const router = useRouter(); // Crear una instancia de useRouter

  const handleLogout = () => {
    setUserSession(null);
    router.push("/login2"); // Redirigir a la página de login
  };

  return (
    <header className="bg-gray-100 p-4 shadow-md flex items-center justify-between">
      <div className="flex items-center">
        <div className="mt-[-6px]">
          <Image
            src="/logo1.PNG"
            alt="Detect Gas Logo"
            width={60}
            height={60}
            priority
          />
        </div>
        <div className="ml-5 mt-2">
          <Image
            src="/detect_letras.PNG"
            alt="Detect Gas Letras"
            width={140}
            height={140}
            priority
          />
        </div>
      </div>

      <nav className="absolute left-1/2 transform -translate-x-1/2">
        <ul className="flex space-x-8 text-lg font-extrabold text-[#00368a]">
          <li>
            <a href="dashboard" className="hover:underline text-shadow">
              INICIO
            </a>
          </li>
          <li>
            <a href="perfil" className="hover:underline text-shadow">
              PERFIL
            </a>
          </li>
          <li>
            <button
              className="hover:underline text-shadow bg-transparent border-none cursor-pointer"
              onClick={handleLogout}
            >
              LOGOUT
            </button>
          </li>
        </ul>
      </nav>

      <div className="flex items-center rounded-md">
        <span className="mr-2 mt-0.5 font-bold">
          {userSession ? userSession.name : "Usuario"}
        </span>{" "}
        {/* Mostrar nombre del usuario */}
        <Image
          className="mt-[-5px]"
          src="/robot.PNG"
          alt="Profile Image"
          width={50}
          height={50}
          priority
        />
      </div>
    </header>
  );
}
