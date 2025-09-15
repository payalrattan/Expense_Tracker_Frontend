"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5002/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {    // or we can use -->    (data.message === "User logged in successfully!")
        alert("User logged in successfully!");
        localStorage.setItem("id", data.id);
        router.push("/dashboard");

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
      <Link href={"/register"}>Open account</Link>
    </div>
  );
};
