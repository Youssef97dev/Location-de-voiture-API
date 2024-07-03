"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterForm = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [adresse, setAdresse] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("api/register", {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        adresse,
      });

      if (res.status === 201) {
        router.replace("/login");
      }
    } catch (error) {
      router.replace("/");
    }
  };
  return (
    <div className="grid place-items-center h-screen">
      <div className="bg-blue-500 shadow-lg p-5 rounded-lg text-black w-[30%]">
        <h1 className="text-xl font-bold my-4">Register</h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            required
            className="bg-white text-black rounded-lg px-3 py-2"
            placeholder="First Name"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            required
            className="bg-white text-black rounded-lg px-3 py-2"
            placeholder="Last Name"
            type="text"
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            required
            className="bg-white text-black rounded-lg px-3 py-2"
            placeholder="Phone Number"
            type="tel"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            required
            className="bg-white text-black rounded-lg px-3 py-2"
            placeholder="Adresse"
            type="text"
            onChange={(e) => setAdresse(e.target.value)}
          />
          <input
            required
            className="bg-white text-black rounded-lg px-3 py-2"
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            className="bg-white text-black rounded-lg px-3 py-2"
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white font-bold cursor-pointer px-6 py-2"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export { RegisterForm };
