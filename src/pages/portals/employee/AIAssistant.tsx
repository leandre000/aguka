
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User } from "lucide-react";
import EmployeePortal from "@/pages/EmployeePortal";
import { EmployeePortalLayout } from "@/components/layouts/EmployeePortalLayout";

export default function AIAssistant() {
  const { t } = useLanguage();

  const conversations = [
    {
      id: 1,
      type: "bot",
      message: "Hello! I'm your HR assistant. How can I help you today?",
      time: "10:30 AM",
    },
    {
      id: 2,
      type: "user",
      message: "How do I request vacation time?",
      time: "10:31 AM",
    },
    {
      id: 3,
      type: "bot",
      message:
        "You can request vacation time through the Leave Requests section in your employee portal. Would you like me to guide you there?",
      time: "10:31 AM",
    },
  ];

  const quickQuestions = [
    "How do I update my profile?",
    "What are my benefits?",
    "How to download payslips?",
    "Leave policy questions",
  ];

  return (
    <EmployeePortalLayout>
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Bot className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">{t('aiTools.chatAssistant') || 'AI Chat Assistant'}</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
          <div className="xl:col-span-3">
            <Card className="h-80 md:h-96">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg md:text-xl">{t('aiTools.chatAssistant') || 'Chat with Assistant'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 h-full flex flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {conversations.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[85%] sm:max-w-xs ${
                          msg.type === "user"
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.type === "user" ? "bg-primary" : "bg-secondary"
                          }`}
                        >
                          {msg.type === "user" ? (
                            <User className="h-4 w-4 text-primary-foreground" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            msg.type === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm break-words">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Input placeholder={t('aiTools.typeMessage') || 'Type your message...'} className="flex-1 min-w-0" />
                  <Button size="icon" className="flex-shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg md:text-xl">{t('aiTools.quickQuestions') || 'Quick Questions'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted w-full justify-start p-2 text-xs sm:text-sm break-words whitespace-normal h-auto"
                  >
                    {question}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </EmployeePortalLayout>
  );
}
