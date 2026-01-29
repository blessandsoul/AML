'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Phone, MoreVertical, Paperclip, ChevronLeft } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const CONVERSATIONS = [
    {
        id: 1,
        user: "AML Support",
        avatar: "",
        lastMessage: "გამარჯობა, თქვენი ინვოისი მზადაა.",
        time: "10:30",
        unread: 2,
        online: true
    },
    {
        id: 2,
        user: "გიორგი მენეჯერი",
        avatar: "https://github.com/shadcn.png",
        lastMessage: "პორტში ჩატვირთვა დაგვიანდება 2 დღით.",
        time: "გუშინ",
        unread: 0,
        online: false
    },
    {
        id: 3,
        user: "ლოჯისტიკის დეპარტამენტი",
        avatar: "",
        lastMessage: "გთხოვთ გამოგვიგზავნოთ მინდობილობა.",
        time: "21 იანვ",
        unread: 0,
        online: true
    }
];

const MESSAGES = [
    {
        id: 1,
        sender: "them",
        text: "გამარჯობა, როგორ შემიძლია დაგეხმაროთ?",
        time: "10:00"
    },
    {
        id: 2,
        sender: "me",
        text: "გამარჯობა, მაინტერესებს BMW X5-ის ტრანსპორტირების სტატუსი.",
        time: "10:05"
    },
    {
        id: 3,
        sender: "them",
        text: "ერთი წუთით, შევამოწმებ ბაზაში...",
        time: "10:06"
    },
    {
        id: 4,
        sender: "them",
        text: "თქვენი ავტომობილის კონტეინერი (MSKU123456) უკვე ფოთის პორტშია. განბაჟების პროცედურები დაიწყება ხვალ.",
        time: "10:15"
    },
    {
        id: 5,
        sender: "them",
        text: "ინვოისი უკვე გამოგზავნილია თქვენს მეილზე.",
        time: "10:30"
    }
];

export function ChatInterface() {
    const [selectedId, setSelectedId] = React.useState(1);
    const [showMobileChat, setShowMobileChat] = React.useState(false);

    return (
        <div className="flex h-[calc(100vh-180px)] min-h-[400px] border rounded-xl overflow-hidden bg-background shadow-sm relative">
            {/* Sidebar */}
            <div className={cn(
                "w-full md:w-80 border-r bg-muted/10 flex flex-col absolute md:relative z-10 bg-background h-full transition-transform duration-300",
                showMobileChat ? "-translate-x-full md:translate-x-0" : "translate-x-0"
            )}>
                <div className="p-3 border-b">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="ძებნა..." className="pl-8 h-9 bg-background text-sm" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {CONVERSATIONS.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => {
                                    setSelectedId(chat.id);
                                    setShowMobileChat(true);
                                }}
                                className={cn(
                                    "flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50",
                                    selectedId === chat.id ? "bg-muted" : ""
                                )}
                            >
                                <div className="relative shrink-0">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={chat.avatar} />
                                        <AvatarFallback>{chat.user[0]}</AvatarFallback>
                                    </Avatar>
                                    {chat.online && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 overflow-hidden">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className="font-semibold truncate text-sm">{chat.user}</span>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate leading-tight">
                                        {chat.lastMessage}
                                    </p>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center mt-0.5 shrink-0">
                                        {chat.unread}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-background absolute md:relative w-full h-full z-20 transition-transform duration-300",
                showMobileChat ? "translate-x-0" : "translate-x-full md:translate-x-0"
            )}>
                {/* Chat Header */}
                <div className="h-14 border-b flex items-center justify-between px-4 bg-background">
                    <div className="flex items-center gap-3">
                        <div className="md:hidden mr-2">
                            <Button variant="ghost" size="icon" onClick={() => setShowMobileChat(false)}>
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                        </div>
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-bold text-sm">AML Support</div>
                            <div className="text-xs text-emerald-600 font-medium">სწრაფი პასუხი</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="hidden sm:inline-flex"><Phone className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                    </div>
                </div>

                {/* Messages List */}
                <ScrollArea className="flex-1 p-4 sm:p-6 bg-muted/5">
                    <div className="space-y-4">
                        {MESSAGES.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-end gap-2 ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <Avatar className="h-8 w-8 hidden sm:block">
                                    <AvatarFallback>{msg.sender === 'me' ? 'ME' : 'AS'}</AvatarFallback>
                                </Avatar>
                                <div
                                    className={`max-w-[75%] sm:max-w-[70%] rounded-2xl p-3 text-sm shadow-sm ${msg.sender === 'me'
                                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                                            : 'bg-white dark:bg-muted border border-border/50 rounded-tl-none'
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                </div>
                                <span className="text-[10px] text-muted-foreground mb-1 select-none">
                                    {msg.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-3 border-t bg-background">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Input placeholder="დაწერეთ შეტყობინება..." className="flex-1 bg-muted/30 border-0 focus-visible:ring-1 focus-visible:bg-background transition-colors h-10" />
                        <Button size="icon" className="shrink-0 bg-primary hover:bg-primary/90 shadow-sm w-10 h-10">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
