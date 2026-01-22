'use client'

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FormInput from "@/components/forms/FormInput";


export default function LoginPage() {
    const router = useRouter()
    const [role, setRole] = useState("patient")
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:8000/auth/login", { ...formData, role })

            localStorage.setItem("token", response.data.token)

            toast.success("เข้าสู่ระบบสำเร็จ!")
            router.push("/")
            router.refresh()

        } catch (error: any) {
            toast.error(error.response?.data?.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง")
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 border rounded-lg shadow-lg bg-white">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">เข้าสู่ระบบ</h1>

                {/* ปุ่มเลือก Role - เลียนแบบหน้า Register */}
                <div className="flex gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setRole("patient")}
                        className={`flex-1 py-2 rounded-md transition ${role === "patient" ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        คนไข้
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("doctor")}
                        className={`flex-1 py-2 rounded-md transition ${role === "doctor" ? "bg-green-600 text-white shadow-md" : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        คุณหมอ
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <FormInput name="email" type="email" placeholder="example@gmail.com" onChange={handleChange} required />
                    </div>
                    <div>
                        <FormInput
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 rounded-lg text-white font-semibold transition ${role === "patient" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        Login เป็น{role === "patient" ? "คนไข้" : "คุณหมอ"}
                    </button>
                </form>
            </div>
        </div>
    )

}