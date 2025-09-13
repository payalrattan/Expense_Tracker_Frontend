"use client";

import Link from "next/link";
import { useState } from "react";

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5002/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, rePassword }),
      });

      const data = await res.json();

      if (res.ok) {    // or we can use -->    (data.message === "User logged in successfully!")
        alert("User registered successfully!");

        setUsername("");
        setEmail("");
        setPassword("");
        setRePassword("");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <label>Username : </label>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />

      <label>Email : </label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Password : </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label>rePassword : </label>
      <input
        type="password"
        value={rePassword}
        onChange={(e) => setRePassword(e.target.value)}
      />

      <button onClick={handleRegister}>Submit</button>
      <Link href={"http://localhost:3001/login"}>Go to Login</Link>
    </div>
  );
};
