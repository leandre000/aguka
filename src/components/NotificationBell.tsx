import { useEffect, useState, useRef } from 'react';
import { Bell, CheckCircle, Loader2 } from 'lucide-react';
import { getNotifications, markNotificationRead } from '@/lib/api';
import { Button } from './ui/button';

interface Notification {
  _id: string;
  type: string;
  title: string;
  content: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) fetchNotifications();
    // Close dropdown on outside click
    function handleClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err: any) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <Button
        ref={bellRef}
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-border rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b font-semibold">Notifications</div>
          {loading ? (
            <div className="flex items-center justify-center p-4"><Loader2 className="animate-spin" /></div>
          ) : error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-muted-foreground">No notifications</div>
          ) : (
            <ul>
              {notifications.slice(0, 10).map((n) => (
                <li key={n._id} className={`flex items-start gap-2 px-4 py-3 border-b last:border-b-0 ${n.read ? 'bg-gray-50 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-1">
                      {n.title}
                      {n.read && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="text-sm text-muted-foreground">{n.content}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                    {n.link && (
                      <a href={n.link} className="text-blue-600 text-xs underline" target="_blank" rel="noopener noreferrer">View</a>
                    )}
                  </div>
                  {!n.read && (
                    <Button size="sm" variant="ghost" onClick={() => handleMarkRead(n._id)}>
                      Mark as read
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="p-2 text-center border-t">
            <span className="text-xs text-blue-600 cursor-pointer hover:underline">View all notifications</span>
          </div>
        </div>
      )}
    </div>
  );
} 