"use client";

import Link from "next/link";
import { useState } from "react";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5002/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {    // or we can use -->    (data.message === "User logged in successfully!")
        alert("User logged in successfully!");

        setEmail("");
        setPassword("");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <label>Email : </label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Password : </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />


      <button onClick={handleLogin}>Submit</button>
      <Link href={"http://localhost:3001/register"}>Open account</Link>
    </div>
  );
};
