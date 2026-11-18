import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  Clock, 
  Calendar as CalendarIcon, 
  Sparkles, 
  BookMarked, 
  X,
  Compass,
  ChevronRight
} from 'lucide-react';
import { User, ViewType } from '../types';

interface SmartGreetingBannerProps {
  currentUser: User;
  setCurrentView: (view: ViewType) => void;
  onOpenTour?: () => void;
}

export default function SmartGreetingBanner({ currentUser, setCurrentView, onOpenTour }: SmartGreetingBannerProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Time-based greeting calculation (using Asia/Karachi or local device time)
  const hour = currentTime.getHours();
  let greeting = 'Good Day';
  let greetingIcon = Sun;
  let greetingColor = 'text-amber-500';

  if (hour >= 5 && hour < 12) {
    greeting = 'Good Morning';
    greetingIcon = Sunrise;
    greetingColor = 'text-amber-500 dark:text-amber-400';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
    greetingIcon = Sun;
    greetingColor = 'text-amber-500 dark:text-amber-400';
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good Evening';
    greetingIcon = Sunset;
    greetingColor = 'text-orange-500 dark:text-orange-400';
  } else {
    greeting = 'Good Night';
    greetingIcon = Moon;
    greetingColor = 'text-indigo-400 dark:text-indigo-300';
  }

  const GreetingIconComponent = greetingIcon;

  // Format date and time
  const timeString = currentTime.toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const dateString = currentTime.toLocaleDateString('en-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Calendar matrix generator for current month
  const currentMonthName = currentTime.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1).getDay();

  return (
    <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 dark:from-[#063028] dark:via-[#04241e] dark:to-[#063028] border-b border-teal-100 dark:border-teal-900/60 py-3 px-4 sm:px-6 lg:px-8 text-xs transition-colors relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Greeting & Personalization */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-[#021c19] border border-teal-100 dark:border-teal-800 flex items-center justify-center shadow-xs">
            <GreetingIconComponent className={`w-4 h-4 ${greetingColor} animate-pulse`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-teal-900 dark:text-teal-100 text-sm">
                {greeting}, {currentUser?.fullName?.split(' ')[0] || 'Reader'}!
              </span>
              {currentUser.role === 'admin' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-800 text-teal-100 dark:bg-teal-700">
                  Administrator
                </span>
              ) : (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Valued Scholar
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-teal-400">
              Welcome to PaperNest. Explore 2,800+ academic volumes and the new Turkish Literature collection.
            </p>
          </div>
        </div>

        {/* Center / Right: Live Digital Clock & Live Calendar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Live Digital Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#021c19] border border-teal-100 dark:border-teal-800 shadow-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="font-bold text-slate-800 dark:text-teal-100 tracking-wider">
              {timeString}
            </span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-sans font-bold">
              PKT
            </span>
          </div>

          {/* Live Date / Calendar Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#021c19] border border-teal-100 dark:border-teal-800 hover:border-teal-400 transition-colors shadow-xs text-slate-700 dark:text-teal-200 font-medium"
              title="Click to view full calendar"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{dateString}</span>
            </button>

            {/* Calendar Popover */}
            {showCalendar && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#063028] border border-teal-200 dark:border-teal-800 rounded-2xl shadow-xl p-4 z-50">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-teal-900">
                  <div className="font-bold text-slate-800 dark:text-teal-100">{currentMonthName}</div>
                  <button onClick={() => setShowCalendar(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {[...Array(firstDayIndex)].map((_, i) => (
                    <span key={`empty-${i}`} className="p-1 text-transparent">0</span>
                  ))}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const dayNum = i + 1;
                    const isToday = dayNum === currentTime.getDate();
                    return (
                      <span
                        key={dayNum}
                        className={`p-1.5 rounded-lg font-medium ${
                          isToday
                            ? 'bg-teal-700 text-white font-bold'
                            : 'text-slate-700 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-teal-900/40'
                        }`}
                      >
                        {dayNum}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Turkish Collection Shortcut */}
          <button
            onClick={() => setCurrentView('turkish-books')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition-all shadow-xs"
          >
            <span>🇹🇷 Turkish Books</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Guided Tour Restart Button */}
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#021c19] border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 hover:bg-teal-50 font-bold transition-colors"
              title="Restart 20-Visit Interactive Website Tour"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Tour Help</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
