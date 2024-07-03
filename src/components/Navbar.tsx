"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex space-x-4">
            <Link passHref href="/">
              <span className="text-gray-700 hover:text-gray-900 font-semibold text-lg">
                Home
              </span>
            </Link>
            <Link passHref href="/cars">
              <span className="text-gray-700 hover:text-gray-900 font-semibold text-lg">
                Cars List
              </span>
            </Link>
            <Link passHref href="/reservations">
              <span className="text-gray-700 hover:text-gray-900 font-semibold text-lg">
                Reservations List
              </span>
            </Link>
          </div>
          <div className="flex space-x-4">
            {!session ? (
              <>
                <Link passHref href="/login">
                  <span className="text-gray-700 hover:text-gray-900 font-semibold text-lg">
                    Login
                  </span>
                </Link>
                <Link passHref href="/register">
                  <span className="text-gray-700 hover:text-gray-900 font-semibold text-lg">
                    Register
                  </span>
                </Link>
              </>
            ) : (
              <button
                className="text-gray-700 hover:text-gray-900 font-semibold text-lg"
                type="button"
                onClick={() => signOut()}
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

export { Navbar };
