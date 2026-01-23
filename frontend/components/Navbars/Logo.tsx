import { Calendar } from "lucide-react"
import Link from "next/link"

const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
                <Calendar className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-blue-600 tracking-tight">ClinicConnect</span>
        </Link>
    )
}
export default Logo