"use client";

import { FaUser, FaUserCircle, FaCalendarAlt, FaFileMedical, FaSignOutAlt } from "react-icons/fa";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import { useRouter } from "next/navigation";

export const UserButton = () => {
    const user = useCurrentUser();
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-teal-500">
                        <FaUser className="text-white h-6 w-6" />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 bg-white text-gray-800 rounded-md shadow-lg border border-gray-200" align="end">
                <DropdownMenuLabel className="flex items-center space-x-2 p-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image || ""} />
                        <AvatarFallback className="bg-teal-500">
                            <FaUser className="text-white h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-sm font-medium text-teal-800">{user?.name || "Usuário"}</p>
                        <p className="text-xs text-gray-500">{user?.email || "email@exemplo.com"}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem 
                    className="flex items-center space-x-2 p-3 hover:bg-teal-50 cursor-pointer"
                    onClick={() => router.push("/settings")}
                >
                    <FaUserCircle className="h-4 w-4 text-teal-600" />
                    <span className="text-sm">Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2 p-3 hover:bg-teal-50 cursor-pointer">
                    <FaCalendarAlt className="h-4 w-4 text-teal-600" />
                    <span className="text-sm">Agendamentos</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2 p-3 hover:bg-teal-50 cursor-pointer">
                    <FaFileMedical className="h-4 w-4 text-teal-600" />
                    <span className="text-sm">Prontuários</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <LogoutButton>
                    <DropdownMenuItem className="flex items-center space-x-2 p-3 hover:bg-teal-50 cursor-pointer">
                        <FaSignOutAlt className="h-4 w-4 text-teal-600" />
                        <span className="text-sm">Sair</span>
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};