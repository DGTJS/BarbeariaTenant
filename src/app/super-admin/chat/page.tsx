"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { MessageSquare, Send, User } from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  tenantId?: string;
  tenantName?: string;
  senderName: string;
  senderType: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // TODO: Implementar API endpoint
      // const response = await fetch("/api/super-admin/chat");
      // if (response.ok) {
      //   const data = await response.json();
      //   setMessages(data);
      // } else {
      //   toast.error("Erro ao buscar mensagens.");
      // }
      toast.info("Funcionalidade em desenvolvimento");
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      toast.error("Erro ao buscar mensagens.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTenant) return;

    try {
      // TODO: Implementar API endpoint
      // const response = await fetch("/api/super-admin/chat", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     tenantId: selectedTenant,
      //     message: newMessage,
      //   }),
      // });

      setNewMessage("");
      toast.success("Mensagem enviada!");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Chat</h1>
        <p className="text-muted-foreground mt-1">
          Comunicação direta com os tenants
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Conversas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma conversa iniciada</p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedTenant === msg.tenantId
                        ? "bg-primary/10 border border-primary"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => setSelectedTenant(msg.tenantId || null)}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <p className="font-medium text-sm">
                        {msg.tenantName || "Tenant"}
                      </p>
                      {!msg.isRead && (
                        <span className="ml-auto h-2 w-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Área de Chat */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedTenant ? "Conversa" : "Selecione uma conversa"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[600px]">
            {selectedTenant ? (
              <>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages
                    .filter(msg => msg.tenantId === selectedTenant)
                    .map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderType === "super_admin"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.senderType === "super_admin"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.createdAt).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === "Enter" && handleSendMessage()}
                    placeholder="Digite sua mensagem..."
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Selecione uma conversa para começar</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
