import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Navigation } from "lucide-react"
import Link from "next/link"

export default function NavDropdownMenu() {
    return (
        <div className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-black/30 border border-white/10 transition-colors duration-300 bg-[#FF52A0]">
            <DropdownMenu>
                <DropdownMenuTrigger className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-black/30 border border-white/10 transition-colors duration-300" asChild>
                    <Button className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-black/30 border border-white/10 transition-colors duration-300 bg-[#FF52A0]"><Navigation className="size-6"/></Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-[16px]">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="capitalize">navigation center</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={'/docs'}>Docs page</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={'/quiz'}>Quiz page</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={'/login'}>Login page</Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}


