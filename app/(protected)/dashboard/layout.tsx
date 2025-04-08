import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | CENID",
  description: "Painel de controle do sistema CENID",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}