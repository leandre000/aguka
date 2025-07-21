/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Users } from "lucide-react";
import { getThreads, getThread, createThread, getMessages, sendMessage, getUsers } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { AdminPortalLayout } from "@/components/layouts/AdminPortalLayout";
import { ManagerPortalLayout } from "@/components/layouts/ManagerPortalLayout";
import { EmployeePortalLayout } from "@/components/layouts/EmployeePortalLayout";
import { RecruiterPortalLayout } from "@/components/layouts/RecruiterPortalLayout";
import { TrainerPortalLayout } from "@/components/layouts/TrainerPortalLayout";
import { AuditorPortalLayout } from "@/components/layouts/AuditorPortalLayout";
import { Combobox } from "@headlessui/react";
import { useLanguage } from "@/contexts/LanguageContext";

const getLayout = (pathname: string) => {
  if (pathname.startsWith("/admin-portal")) return AdminPortalLayout;
  if (pathname.startsWith("/manager-portal")) return ManagerPortalLayout;
  if (pathname.startsWith("/employee-portal")) return EmployeePortalLayout;
  if (pathname.startsWith("/recruiter-portal")) return RecruiterPortalLayout;
  if (pathname.startsWith("/trainer-portal")) return TrainerPortalLayout;
  if (pathname.startsWith("/auditor-portal")) return AuditorPortalLayout;
  return React.Fragment;
};

export default function Messages() {
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();
  const Layout = getLayout(location.pathname);
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [creatingThread, setCreatingThread] = useState(false);
  const [newThreadSubject, setNewThreadSubject] = useState("");
  const [threadParticipants, setThreadParticipants] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [participantQuery, setParticipantQuery] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);

  // Fetch all users for participant selection
  useEffect(() => {
    if (user?.role === 'admin') {
      getUsers()
        .then((res: any) => setAllUsers(res.data || []))
        .catch(() => setAllUsers([]));
    } else {
      setAllUsers([]); // Non-admins cannot fetch all users
    }
  }, [user]);

  // Fetch threads
  const fetchThreads = () => {
    setLoadingThreads(true);
    getThreads()
      .then(setThreads)
      .catch((err) => setError(err.message || "Failed to load threads"))
      .finally(() => setLoadingThreads(false));
  };
  useEffect(() => { fetchThreads(); }, []);

  // Fetch messages for selected thread
  const fetchMessages = (threadId: string) => {
    setLoadingMessages(true);
    getMessages({ thread: threadId })
      .then(setMessages)
      .catch((err) => setError(err.message || "Failed to load messages"))
      .finally(() => setLoadingMessages(false));
  };
  useEffect(() => {
    if (selectedThread?._id) fetchMessages(selectedThread._id);
  }, [selectedThread]);

  // Filter users for combobox/autocomplete
  const filteredUsers = participantQuery === ""
    ? allUsers
    : allUsers.filter((u) =>
        (u.Names || u.name || u.email || u.role)
          .toLowerCase()
          .includes(participantQuery.toLowerCase())
      );

  // Create new thread
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newThreadSubject.trim()) {
      setError("Thread subject is required.");
      return;
    }
    if (selectedParticipants.length === 0) {
      setError("Please select at least one participant.");
      return;
    }

    try {
      const thread = await createThread({
        subject: newThreadSubject,
        participants: selectedParticipants.map((u) => u._id),
      });
      setNewThreadSubject("");
      setSelectedParticipants([]);
      setParticipantQuery("");
      setCreatingThread(false);
      fetchThreads();
      setSelectedThread(thread);
    } catch (err: any) {
      setError(
        err?.error?.includes("Cast to [ObjectId] failed")
          ? "Invalid participant(s) selected."
          : err?.message || "Failed to create thread"
      );
    }
  };

  // Send new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newMessage.trim() || !selectedThread) return;

    // Recipients: all except current user
    const recipients = selectedThread.participants
      .filter((p: any) => p._id !== user._id)
      .map((p: any) => p._id);

    if (recipients.length === 0) {
      setError("At least one recipient is required to send a message.");
      return;
    }

    try {
      await sendMessage({
        recipients,
        content: newMessage,
        thread: selectedThread._id,
      });
      setNewMessage("");
      fetchMessages(selectedThread._id);
    } catch (err: any) {
      setError(
        err?.message?.includes("At least one recipient is required")
          ? "Please select at least one recipient."
          : err?.message || "Failed to send message"
      );
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Threads List */}
          <div className="w-full md:w-1/3 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2"><MessageSquare className="h-5 w-5" />{t('messages.threads') || 'Threads'}</h2>
              <Button size="sm" onClick={() => setCreatingThread((v) => !v)}>{creatingThread ? (t('messages.cancel') || 'Cancel') : (t('messages.newThread') || 'New Thread')}</Button>
            </div>
            {creatingThread && (
              <form onSubmit={handleCreateThread} className="space-y-2">
                <Input
                  placeholder={t('messages.subject') || 'Subject'}
                  value={newThreadSubject}
                  onChange={e => setNewThreadSubject(e.target.value)}
                />
                {/* Autocomplete for participants */}
                <Combobox
                  as="div"
                  value={selectedParticipants}
                  onChange={setSelectedParticipants}
                  multiple
                  data-lov-id="participants"
                  data-lov-name="Participants"
                  data-component-path="src/pages/Messages.tsx"
                  data-component-line="54"
                  data-component-file="Messages.tsx"
                  data-component-name="Combobox"
                  data-component-content="Participant selection"
                  data-headlessui-state={creatingThread ? "open" : "closed"}
                >
                  <Combobox.Input
                    placeholder={t('messages.typeParticipant') || 'Type name, email or role'}
                    className="w-full border rounded px-2 py-1"
                    displayValue={(users: any[]) => users.map(u => u.Names || u.name || u.email).join(", ")}
                    onChange={e => setParticipantQuery(e.target.value)}
                  />
                  <Combobox.Options>
                    {filteredUsers.map((u) => (
                      <Combobox.Option key={u._id} value={u}>
                        {u.Names || u.name || u.email} {u.role ? <span className="text-xs text-muted-foreground">({u.role})</span> : null}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Combobox>
                <Button type="submit" size="sm">{t('messages.create') || 'Create'}</Button>
              </form>
            )}
            {loadingThreads ? (
              <div>{t('messages.loadingThreads') || 'Loading threads...'}</div>
            ) : (
              <div className="space-y-2">
                {threads.map((thread) => (
                  <Card key={thread._id} className={selectedThread?._id === thread._id ? "border-primary" : ""}>
                    <CardContent className="cursor-pointer" onClick={() => setSelectedThread(thread)}>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="font-semibold">{thread.subject}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{t('messages.participants') || 'Participants'}: {thread.participants.map((p: any) => p.Names || p.name || p.email || p._id).join(", ")}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Messages in Thread */}
          <div className="flex-1 space-y-4">
            {selectedThread ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedThread.subject}</CardTitle>
                  <div className="text-xs text-muted-foreground">{t('messages.participants') || 'Participants'}: {selectedThread.participants.map((p: any) => p.Names || p.name || p.email || p._id).join(", ")}</div>
                </CardHeader>
                <CardContent>
                  {loadingMessages ? (
                    <div>{t('messages.loadingMessages') || 'Loading messages...'}</div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {messages.map((msg: any) => (
                        <div key={msg._id} className={`flex ${msg.sender?._id === user._id ? "justify-end" : "justify-start"}`}>
                          <div className={`p-2 rounded-lg ${msg.sender?._id === user._id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                            <div className="text-sm">{msg.content}</div>
                            <div className="text-xs opacity-70 mt-1">{msg.sender?.Names || msg.sender?.name || msg.sender?.email || msg.sender} • {new Date(msg.createdAt).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
                    <Input placeholder={t('messages.typeMessage') || 'Type your message...'} value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                    <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="text-muted-foreground text-center mt-16">{t('messages.selectThread') || 'Select a thread to view messages.'}</div>
            )}
          </div>
        </div>
        {error && <div className="text-red-600 text-center">{error}</div>}
      </div>
    </Layout>
  );
}