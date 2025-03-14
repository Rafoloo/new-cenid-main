"use client";

import { useTransition } from "react";
import { useSession } from "next-auth/react"

import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { settings } from "@/actions/settings";

const SettingsPage = () => {
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();
    const onClick = () => {
        startTransition(() => {
        settings({
            name: "Novo Nome!"
        })
        .then(() =>{
            update();
        })
    })
    }

    return ( 
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Configurações
                </p>
            </CardHeader>
            <CardContent>
                <Button disabled={isPending} onClick={onClick}>
                    Atualizar Nome
                </Button>
            </CardContent>
        </Card>
     );
}
 
export default SettingsPage;