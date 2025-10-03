import { MyOrdersList } from "@/components/orders/my-orders-list";

export const metadata = {
  title: "My Orders - Developer Portfolio",
  description: "View and manage all your purchased templates.",
};

export default function MyOrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <MyOrdersList />
      </main>
    </div>
  );
}
