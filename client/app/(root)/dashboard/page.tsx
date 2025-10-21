import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";

export const metadata = {
  title: "Dashboard - Developer Portfolio",
  description:
    "Manage your account, view purchase history, and download your templates.",
};
const mockUser = {
  role: "user", // Change to "user" to see user dashboard
  name: "John Doe",
  email: "john.doe@example.com",
};

export default function DashboardPage() {
  return (
    <div className="wrapper">
      <main className="py-20">
        {mockUser.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
      </main>
    </div>
  );
}
