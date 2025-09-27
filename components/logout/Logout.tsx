"use client";

import { useRouter } from "next/navigation";

export const LogoutForm = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5002/api/logout", {
        method: "POST",
        credentials: "include", // this line to send the cookies with my request
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);  
        router.push("/login");
      } else {
        alert(data.message || "Logout failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
        <button onClick={handleLogout}>LOGOUT</button>
    </div>
  );
};