"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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
    console.log(firstName);
    try {
      const res = await axios.post("api/register", {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        adresse,
      });

      if (res.status == 201) {
        router.replace("/login");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };
  return (
    <div className="grid place-items-center h-screen">
      <div className="bg-blue-500 shadow-lg p-5 rounded-lg text-black w-[30%]">
        <h1 className="text-xl font-bold my-4">Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setFirstName(e.target.value)}
            type={"text"}
            placeholder="First Name"
            className="bg-white text-black rounded-lg px-3 py-2"
            required
          />
          <input
            onChange={(e) => setLastName(e.target.value)}
            type={"text"}
            placeholder="Last Name"
            className="bg-white text-black rounded-lg px-3 py-2"
            required
          />
          <input
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="bg-white text-black rounded-lg px-3 py-2"
            required
            type={"tel"}
          />
          <input
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="Adresse"
            className="bg-white text-black rounded-lg px-3 py-2"
            required
            type={"text"}
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type={"email"}
            placeholder="Email"
            className="bg-white text-black rounded-lg px-3 py-2"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type={"password"}
            placeholder="Password"
            required
            className="bg-white text-black rounded-lg px-3 py-2"
          />
          <button className="bg-blue-600 text-white font-bold cursor-pointer px-6 py-2">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
