import { useContext } from "react";
import Image from "next/image";
import { UserContext } from "../context/userContext";

export default function Header() {
  const user = useContext(UserContext);
  const {setUserSession} = user;
  return (
    <header className="bg-gray-100 p-4 shadow-md flex items-center justify-between">
      <div className="flex items-center">
        <Image src="/logo.png" alt="Detect Gas Logo" width={110} height={100} />
        <div className="ml-2">
          <h1 className="text-lg font-bold">DETECT GAS</h1>
          <p className="text-sm font-bold">analizador de gases</p>
        </div>
      </div>

      <nav className="flex-1 flex justify-center">
        <ul className="flex space-x-8 text-lg font-semibold">
          <li>
            <a href="#" className="hover:underline">
              INICIO
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              PERFIL
            </a>
          </li>
          <li>
            <a href="login" className="hover:underline">
              LOGIN
            </a>
          </li>
          <li>
            <div href="login" className="hover:underline" onClick={() => setUserSession(null)}>
              LOGOUT
            </div>
          </li>
        </ul>
      </nav>

      <div className="flex items-center rounded-md">
        <Image
          className="rounded-lg"
          src="/avatar.png"
          alt="Profile Icon"
          width={50}
          height={60}
        />
        <span className="ml-4 text-lg font-bold">Ian Stuart</span>
      </div>
    </header>
  );
}
