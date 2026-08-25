import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Inbox } from 'lucide-react';
import { AppNotification } from '../../types/navigation';

export const NotificationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        id="btn-notification-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-left">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">Notifications</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {unreadCount} unread
              </span>
            </div>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List or Honest Empty State */}
          <div className="p-4">
            {notifications.length === 0 ? (
              <div className="py-8 text-center space-y-2 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                  <Inbox className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No new notifications</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[220px]">
                  You're all caught up on civic quests, reports, and community updates.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl text-xs transition-colors ${
                      item.isRead
                        ? 'bg-transparent text-slate-600 dark:text-slate-400'
                        : 'bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-900 dark:text-slate-100 font-medium'
                    }`}
                  >
                    <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.message}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{item.timestamp}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Notice */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[10px] text-slate-400 dark:text-slate-500 text-center">
            Real-time notifications connect to community events & reports
          </div>
        </div>
      )}
    </div>
  );
};
