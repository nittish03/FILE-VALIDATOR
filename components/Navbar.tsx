"use client";
import { useState } from "react";
import NavLink from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { FiMenu, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import Button from '@/components/uiverse/Button'

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="px-4 h-14 sticky top-0 inset-x-0 w-full bg-background/40 backdrop-blur-lg z-50">
      <div className="flex items-center justify-between h-full mx-auto md:max-w-screen-xl">
        <div className="flex items-center">
          <span className="text-lg font-medium">FRONTEND</span>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl transition-all duration-300 ease-in-out"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 ">
          {[
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
          ].map((item) => (
            <NavLink key={item.href} href={item.href} className="relative text-sm hover:text-foreground/80">
              <span className={
                pathname === item.href
                  ? "after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue-600"
                  : ""
              }>
                {item.name}
              </span>
            </NavLink>
          ))}
        </ul>

        {/* Auth Controls */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-lg font-koho">{session.user?.name?.split(" ")[0]}</span>
              <button
                className="flex items-center justify-center bg-white text-green-600 p-2 rounded-full hover:bg-green-200"
                onClick={handleLogout}
              >
                <CgProfile size={30} />
              </button>
            </div>
          ) : (
            <NavLink href="/login">
<Button purpose={"Get Started"}/>
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black transition-all ease-in-out duration-200 absolute top-14 left-0 w-full bg-background/90 backdrop-blur-md shadow-md p-4 flex flex-col items-center gap-4">
          {[
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
          ].map((item) => (
            <NavLink key={item.href} href={item.href} className="text-sm hover:text-foreground/80" onClick={() => setMenuOpen(false)}>
              <span className={
                pathname === item.href
                  ? "border-b-2 border-blue-600"
                  : ""
              }>
                {item.name}
              </span>
            </NavLink>
          ))}

          {session ? (
            <button
              className="mt-4 flex items-center gap-2 text-lg"
              onClick={handleLogout}
            >
              Logout <CgProfile size={24} />
            </button>
          ) : (
            <NavLink href="/login" onClick={() => setMenuOpen(false)}>
<Button purpose={"Get Started"}/>
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
}
