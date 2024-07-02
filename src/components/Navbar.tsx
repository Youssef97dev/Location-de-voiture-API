"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex space-x-4">
            <Link href="/" passHref>
              <span className="text-gray-700 hover:text-gray-900 font-semibold text-lg">
                Home
              </span>
            </Link>
            <Link href="/cars" passHref>
              <span className="text-gray-700 hover:text-gray-900 font-semibold text-lg">
                Cars List
              </span>
            </Link>
            <Link href="/reservations" passHref>
              <span className="text-gray-700 hover:text-gray-900 font-semibold text-lg">
                Reservations List
              </span>
            </Link>
          </div>
          <div className="flex space-x-4">
            {!session ? (
              <>
                <Link href="/login" passHref>
                  <span className="text-gray-700 hover:text-gray-900 font-semibold text-lg">
                    Login
                  </span>
                </Link>
                <Link href="/register" passHref>
                  <span className="text-gray-700 hover:text-gray-900 font-semibold text-lg">
                    Register
                  </span>
                </Link>
              </>
            ) : (
              <button
                onClick={() => signOut()}
                className="text-gray-700 hover:text-gray-900 font-semibold text-lg"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
