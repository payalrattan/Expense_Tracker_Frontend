"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutForm } from "@/components/logout/Logout";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:5002/verify", {
          credentials: "include"
        });

        if (!res.ok) {
          router.push("/login"); // if there is no TOKEN, it will return to login page
        } else {
          setLoading(false);
        }
      } catch {
        router.push("/login");
      }
    };

    checkLogin();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome to your dashboard!</h1>
      <LogoutForm/>
    </div>
  );
}
