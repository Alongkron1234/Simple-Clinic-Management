'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Camera, User, Mail, Phone, ShieldCheck } from "lucide-react";
import FormInput from "@/components/forms/FormInput";

export default function ProfilePage() {

    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await axios.get("http://localhost:8000/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUser(res.data)
            } catch (err) {
                toast.error("ไม่สามารถดึงรูปโปรฟายได้")
            } finally {
                setLoading(false)
            }
        }
        fetchMe()
    }, [])


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) return
        const formData = new FormData()
        formData.append("image", file)

        try {
            const token = localStorage.getItem("token")
            const res = await axios.patch("http://localhost:8000/auth/profile-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", //
                    Authorization: `Bearer ${token}`,
                },
            })
            toast.success("อัปเดตรูปโปรไฟล์สำเร็จ!")
            setUser({ ...user, profile_img: res.data.profile_img });
            setTimeout(() => {
                window.location.reload();
            }, 1000);

            setFile(null);
            setPreview(null);
        } catch (error) {
            toast.error("อัปโหลดไม่สำเร็จ");
        }
    }
    if (loading) return <div className="p-10 text-center">กำลังโหลดข้อมูล...</div>;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="flex flex-col items-center">
                {/* Profile Image Section */}
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-4 bg-gray-100 shadow-md">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : user?.profile_img ? (
                            <img src={`http://localhost:8000/uploads/${user.profile_img}?t=${new Date().getTime()}`} alt="Profile" className="w-full h-full object-cover" /> //
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User size={48} />
                            </div>
                        )}
                    </div>
                    <label className="absolute bottom-4 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 transition shadow-lg">
                        <Camera size={20} />
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                </div>

                {file && (
                    <button onClick={handleUpload} className="mb-4 text-xs bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transition">
                        บันทึกรูปภาพใหม่
                    </button>
                )}

                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                    {user?.firstname} {user?.lastname}
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase mt-2">
                    {user?.role}
                </span>
            </div>

            <div className="mt-8 space-y-4">
                <FormInput label="อีเมล" name="email" type="email" defaultValue={user?.email} onChange={() => { }} required={false} />
                <FormInput label="เบอร์โทรศัพท์" name="phone" type="text" defaultValue={user?.phone || "ยังไม่ได้ระบุ"} onChange={() => { }} required={false} />

                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <ShieldCheck className="text-green-500 mr-4" size={24} />
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Account Status</p>
                        <p className="text-gray-700 font-medium">Verified Account</p>
                    </div>
                </div>
            </div>
        </div>
    )
}




