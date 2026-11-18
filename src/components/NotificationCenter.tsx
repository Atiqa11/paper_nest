import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  X, 
  BookMarked, 
  Tag, 
  Truck, 
  AlertTriangle, 
  Sparkles,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { NotificationItem, ViewType } from '../types';
import { storageService } from '../services/storage';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentView: (view: ViewType) => void;
}

export default function NotificationCenter({ isOpen, onClose, setCurrentView }: NotificationCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isOpen) return null;

  const notifications = storageService.getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkRead = (id: string) => {
    storageService.markNotificationRead(id);
    setRefreshKey(k => k + 1);
  };

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsRead();
    setRefreshKey(k => k + 1);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.read) {
      storageService.markNotificationRead(item.id);
    }
    if (item.linkView) {
      setCurrentView(item.linkView);
    }
    onClose();
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'arrival':
        return <BookMarked className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'promo':
        return <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'order':
        return <Truck className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'stock':
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-sm bg-white dark:bg-[#063028] text-slate-800 dark:text-emerald-50 h-full shadow-2xl z-10 flex flex-col border-l border-teal-100 dark:border-teal-900/60 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-teal-100 dark:border-teal-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center text-teal-700 dark:text-teal-300">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-teal-100">Notifications</h2>
              <p className="text-[11px] text-slate-400">{unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="p-1.5 rounded-lg text-[11px] font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-teal-900/40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-teal-900/40 flex gap-2 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              filter === 'all'
                ? 'bg-teal-700 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-teal-900/30'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              filter === 'unread'
                ? 'bg-teal-700 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-teal-900/30'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-teal-900/30 p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-teal-900/40 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">No notifications here</p>
              <p className="text-[11px] text-slate-400 mt-1">You're all caught up with your orders and bookstore alerts.</p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 relative ${
                  item.read
                    ? 'hover:bg-slate-50 dark:hover:bg-teal-950/40 opacity-75'
                    : 'bg-teal-50/50 dark:bg-[#04241e] hover:bg-teal-50 dark:hover:bg-[#03201a] border border-teal-100 dark:border-teal-900/40'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#063028] shadow-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-teal-100 line-clamp-1">
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-teal-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100/60 dark:border-teal-900/30 text-[10px] text-slate-400">
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    {item.linkView && (
                      <span className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-0.5">
                        View <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
