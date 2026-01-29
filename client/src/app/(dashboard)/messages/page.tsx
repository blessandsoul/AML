import { ChatInterface } from "@/components/dashboard/shared/ChatInterface";

export default function MessagesPage() {
    return (
        <div className="h-full">
            <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight">შეტყობინებები</h1>
            </div>

            <ChatInterface />
        </div>
    );
}
