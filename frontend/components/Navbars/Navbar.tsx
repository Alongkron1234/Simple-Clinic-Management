'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LogOut, User, Home, Calendar } from "lucide-react";
import Logo from "./Logo";
import MenuItems from "./MenuItems";


export default function Navbar() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token")
            if (!token) return
            try {
                const res = await axios.get("http://localhost:8000/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUser(res.data)

            } catch (err) {
                localStorage.removeItem("token")
                setUser(null)
            }
        }
        fetchUser()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        setUser(null)
        router.push("/login")
        router.refresh()
    }

    return (
        <nav className="bg-white shadow-md border-b">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                {/* logo */}
                <Logo />
                {/* menuItem */}
                <MenuItems user={user} handleLogout={handleLogout} />
            </div>

        </nav>
    )

}