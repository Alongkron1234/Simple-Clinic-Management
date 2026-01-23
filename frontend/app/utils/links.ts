import { Home } from "lucide-react";

export const getNavLinks = (pathname: string) => [
    {
        href: "/",
        label: "ภาพรวม",
        icon: Home,
        active: pathname === "/",
    },
    {
        href: "/appointment",
        label: "นัดหมาย",
        icon: Home,
        active: pathname.startsWith("/appointment"),
    },
    {
        href: "/profile",
        label: "ข้อมูลส่วนตัว",
        icon: Home,
        active: pathname.startsWith("/profile"),
    },
]
