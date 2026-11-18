import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  BookOpen,
  Search,
  BookMarked,
  Layers,
  Zap,
  ShoppingCart,
  Heart,
  Bot,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { ViewType } from '../types';
import { storageService } from '../services/storage';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentView: (view: ViewType) => void;
}

interface TourStep {
  title: string;
  description: string;
  badge: string;
  icon: React.ElementType;
  targetView: ViewType;
  arrowDirection: 'up' | 'down' | 'left' | 'right';
  tip: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to PaperNest Bookstore',
    description: 'Pakistan\'s premier intelligent bookstore. We stock over 2,800+ authentic volumes across 54 categories, each backed by real publishers and verified authors.',
    badge: 'Introduction',
    icon: BookOpen,
    targetView: 'home',
    arrowDirection: 'down',
    tip: 'Explore the hero banner and curated selections below.'
  },
  {
    title: 'Live Digital Clock & Greeting Banner',
    description: 'Notice the top bar showing real-time Pakistani Time (PKT), local time-based greetings, and a live monthly calendar widget.',
    badge: 'Live Time',
    icon: Sparkles,
    targetView: 'home',
    arrowDirection: 'up',
    tip: 'The greeting dynamically adapts to Morning, Afternoon, Evening, and Night.'
  },
  {
    title: 'Live Autocomplete Search Bar',
    description: 'Type any book title, author (e.g. Orhan Pamuk, Umera Ahmed), or syllabus (CSS, MDCAT). Instant suggestions with book thumbnails and prices appear as you type.',
    badge: 'Search',
    icon: Search,
    targetView: 'home',
    arrowDirection: 'down',
    tip: 'Press Enter or click any suggested book to view synopsis.'
  },
  {
    title: '🇹🇷 Dedicated Turkish Books Collection',
    description: 'Explore 54 verified Turkish literary masterpieces by Orhan Pamuk, Elif Shafak, Sabahattin Ali, Yaşar Kemal, and Nazım Hikmet in Turkish, English, and Urdu.',
    badge: 'New Collection',
    icon: BookMarked,
    targetView: 'turkish-books',
    arrowDirection: 'up',
    tip: 'Filter by author, language edition, and genre with live inventory.'
  },
  {
    title: '54 Categories & 50-Book Target Progress',
    description: 'Every single category in PaperNest contains at least 50 unique books. The Categories page tracks live inventory units and target achievement in real time.',
    badge: 'Taxonomy',
    icon: Layers,
    targetView: 'categories',
    arrowDirection: 'down',
    tip: 'Look for the 100% Target Met green badges on every collection.'
  },
  {
    title: '⚡ Flash Sale with Live Countdown',
    description: 'Limited-time deals with savings up to 35% on bestsellers. The countdown timer ticks every second in real time.',
    badge: 'Special Deals',
    icon: Zap,
    targetView: 'home',
    arrowDirection: 'down',
    tip: 'Discounts are applied instantly at checkout without needing coupons.'
  },
  {
    title: 'Daily Reading Challenge & Streak',
    description: 'Track daily reading goals, log pages read with one click (+5, +15), and maintain your active reading streak!',
    badge: 'Habits',
    icon: Sparkles,
    targetView: 'home',
    arrowDirection: 'down',
    tip: 'Your daily pages and streak are saved directly in your browser.'
  },
  {
    title: 'Smart Shopping Cart & COD',
    description: 'Add books, adjust quantities, apply promo codes like WELCOME15, and enjoy Free Delivery on orders above Rs. 2,500.',
    badge: 'Cart',
    icon: ShoppingCart,
    targetView: 'cart',
    arrowDirection: 'up',
    tip: 'Click the Cart icon in the navbar anytime to review items.'
  },
  {
    title: 'My Wishlist & Saved Reads',
    description: 'Save titles to your personal wishlist with the heart button on any card. Move saved books to cart whenever you are ready.',
    badge: 'Wishlist',
    icon: Heart,
    targetView: 'wishlist',
    arrowDirection: 'up',
    tip: 'Items remain stored safely across visits.'
  },
  {
    title: 'Advanced AI Assistant Suite (8 Modes)',
    description: 'Chat with PaperNest AI for Book Matchmaking, Summaries, Turkish-Urdu-English Translation, CSS/MDCAT Exam Tutoring, and Gift Recommendations.',
    badge: 'AI Engine',
    icon: Bot,
    targetView: 'ai-assistant',
    arrowDirection: 'up',
    tip: 'Equipped with a smart catalog-aware rule-based fallback.'
  },
  {
    title: 'Real-Time Order Tracking & Dispatch',
    description: 'Track your packages with live shipment stepper across 9 statuses from Packing to TCS Express and Leopards Courier delivery.',
    badge: 'Logistics',
    icon: Truck,
    targetView: 'order-tracking',
    arrowDirection: 'down',
    tip: 'Sample tracking numbers like TCS-PK-9823412 work in demo mode.'
  },
  {
    title: 'Admin Control Center & Logistics Hub',
    description: 'Full administrative suite: inventory valuation, stock adjustments, printable thermal shipping airway bills, and courier dispatching.',
    badge: 'Admin',
    icon: ShieldCheck,
    targetView: 'admin-dashboard',
    arrowDirection: 'down',
    tip: 'Switch between Customer and Admin roles via the Account menu.'
  }
];

export default function GuidedTourModal({ isOpen, onClose, setCurrentView }: GuidedTourModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const onboardingState = storageService.getOnboardingState();
  const visitNumber = Math.min(20, onboardingState.visitCount || 1);
  const step = TOUR_STEPS[currentStepIndex];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setCurrentView(TOUR_STEPS[nextIdx].targetView);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setCurrentView(TOUR_STEPS[prevIdx].targetView);
    }
  };

  const handleFinish = () => {
    storageService.completeGuidedTour();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-center justify-center p-4">
      {/* Semi-transparent backdrop with click to skip */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto transition-opacity"
        onClick={handleFinish}
      />

      {/* Floating Guided Tour Card */}
      <div className="relative pointer-events-auto bg-white dark:bg-[#063028] text-slate-800 dark:text-emerald-50 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border-2 border-teal-500 dark:border-teal-400 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Animated Directional Arrow Indicator */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg animate-bounce border-2 border-white dark:border-[#063028]">
            {step.arrowDirection === 'up' ? (
              <ArrowUp className="w-6 h-6" />
            ) : (
              <ArrowDown className="w-6 h-6" />
            )}
          </div>
        </div>

        {/* Card Header: Visit Progress & Close */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-teal-100 dark:border-teal-900/60 mt-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-xs font-bold">
              Visit {visitNumber} of 20
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={handleFinish}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-teal-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Skip Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body: Step Icon, Title & Description */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center flex-shrink-0">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                {step.badge}
              </span>
              <h3 className="text-lg font-extrabold text-teal-900 dark:text-teal-100 font-display leading-snug">
                {step.title}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {step.description}
          </p>

          <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-[#04241e] border border-teal-100 dark:border-teal-900/40 text-[11px] text-teal-900 dark:text-teal-200 flex items-start gap-2">
            <Compass className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
            <span><strong>Pro Tip:</strong> {step.tip}</span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-teal-950 rounded-full overflow-hidden mb-5">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Card Controls: Prev, Next, Skip, Finish */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleFinish}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-teal-700 font-semibold transition-colors"
          >
            Skip Tutorial
          </button>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-bold hover:bg-teal-50 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow transition-colors flex items-center gap-1.5"
            >
              <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              {currentStepIndex === TOUR_STEPS.length - 1 ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
