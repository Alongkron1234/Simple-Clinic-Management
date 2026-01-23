import { getNavLinks } from "@/app/utils/links"
import { LogOut, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface UserMenuProps {
    user: any
    handleLogout: () => void
}
const MenuItems = ({ user, handleLogout }: UserMenuProps) => {

    const pathname = usePathname()
    const routes = getNavLinks(pathname)
    if (user) {
        return (
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    {routes.map((route) => {
                        const isActive = pathname === route.href;
                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`}
                            >
                                <route.icon className="h-4 w-4" />
                                {route.label}
                            </Link>
                        );
                    })}
                </div>
                <div className="h-6 w-[1px] bg-gray-200"></div>
                <Link href="/profile" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                        {user.profile_img ? (
                            <img
                                src={`http://localhost:8000/uploads/${user.profile_img}`}
                                className="w-full h-full object-cover"
                                alt="Profile"
                            />
                        ) : (
                            <User className="w-full h-full p-1 text-gray-500" />
                        )}
                    </div>

                    <span className="text-gray-700 font-medium group-hover:text-blue-600">
                        {user.firstname}
                    </span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition font-medium"
                >
                    <LogOut size={18} />
                    ออกจากระบบ
                </button>
            </div>
        )
    }
    return (
        <div className="flex items-center gap-3">
            <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 font-medium text-sm px-3 py-2"
            >
                เข้าสู่ระบบ
            </Link>
            <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
            >
                สมัครสมาชิก
            </Link>
        </div>
    )
}
export default MenuItems