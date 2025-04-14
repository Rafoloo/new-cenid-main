import NextAuth, {type DefaultSession} from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    id: string;
    role: UserRole;
}
export const authOptions = {
    providers: [...],
    secret: process.env.NEXTAUTH_SECRET,

}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}
