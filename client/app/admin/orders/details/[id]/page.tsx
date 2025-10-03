import { OrderDetails } from "@/components/admin/orders/OrderDetails";

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  return <OrderDetails orderId={params.id} />;
}
