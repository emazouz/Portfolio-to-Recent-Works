import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Emazouz developer portfolio Admin Dashboard",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
