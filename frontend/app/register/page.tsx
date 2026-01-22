'use client'
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import z from "zod";
import { registerSchema } from "../utils/Schemas";
import FormInput from "@/components/forms/FormInput";


export default function RegisterPage() {
    const router = useRouter()
    const [role, setRole] = useState("patient")
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validation = registerSchema.safeParse(formData)
        if (!validation.success) {
            // const firstError = validation.error?.errors?.[0]?.message || "ข้อมูลไม่ถูกต้อง";
            console.log(validation.error)
            const firstError = validation.error?.issues?.[0]?.message || "ข้อมูลไม่ถูกต้อง";

            toast.error(firstError)
            return
        }

        try {
            const response = await axios.post(`http://localhost:8000/auth/register/${role}`, formData)
            // alert("สมัครสมาชิกสำเร็จ")
            toast.success("สมัครสมาชิกสำเร็จ")
            router.push("/login")
        } catch (error: any) {
            console.log("ERROR")
            const errorMsg = error.response?.data?.error || "เกิดข้อผิดพลาด";
            toast.error(errorMsg);
            // alert(error.response?.data?.error || "เกิดข้อผิดพลาด")

        }
    }
    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">สมัครสมาชิก Clinic Connect</h1>
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setRole("patient")}
                    className={`flex-1 py-2 rounded ${role === "patient" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    เป็นคนไข้
                </button>
                <button
                    onClick={() => setRole("doctor")}
                    className={`flex-1 py-2 rounded ${role === "doctor" ? "bg-green-500 text-white" : "bg-gray-200"}`}
                >
                    เป็นหมอ
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input ต่างๆ เหมือนเดิม */}
                <FormInput name="firstname" placeholder="ชื่อจริง" onChange={handleChange} type="text" />
                <FormInput name="lastname" placeholder="นามสกุล" onChange={handleChange} type="text" />
                <FormInput name="email" type="email" placeholder="อีเมล" onChange={handleChange} />
                <FormInput name="password" type="password" placeholder="รหัสผ่าน" onChange={handleChange} />
                <FormInput name="phone" placeholder="เบอร์โทรศัพท์" onChange={handleChange} type="text" />

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    ลงทะเบียนเป็น {role === "patient" ? "คนไข้" : "คุณหมอ"}
                </button>
            </form>
        </div>

    )
}