import { OrderList } from "@/components/dashboard/orders/OrderList";

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">ჩემი შეკვეთები</h1>
                <p className="text-muted-foreground">თვალი ადევნეთ თქვენს შეკვეთებს და ტრანსპორტირების სტატუსს.</p>
            </div>

            <OrderList />
        </div>
    );
}
