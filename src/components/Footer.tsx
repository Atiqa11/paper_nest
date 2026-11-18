import React from 'react';
import { BookOpen, Mail, Phone, MapPin, Heart, ExternalLink } from 'lucide-react';
import { ViewType } from '../types';

interface FooterProps {
  setCurrentView: (v: ViewType) => void;
}

export default function Footer({ setCurrentView }: FooterProps) {
  const year = new Date().getFullYear();

  const shopLinks = [
    { label: "All Books",           view: 'library'    as ViewType },
    { label: "Novels & Fiction",    view: 'novels'     as ViewType },
    { label: "Newspapers",          view: 'newspapers' as ViewType },
    { label: "Stationery",          view: 'stationery' as ViewType },
    { label: "Exam Preparation",    view: 'exam-prep'  as ViewType },
    { label: "Ideological Books",   view: 'ideological'as ViewType },
  ];

  const categoryLinks = [
    { label: "CSS Preparation",     view: 'exam-prep'  as ViewType },
    { label: "MDCAT / ECAT Prep",   view: 'exam-prep'  as ViewType },
    { label: "School Textbooks",    view: 'academic'   as ViewType },
    { label: "University Books",    view: 'academic'   as ViewType },
    { label: "Children's Books",    view: 'library'    as ViewType },
    { label: "Poetry & Literature", view: 'novels'     as ViewType },
  ];

  const helpLinks = [
    { label: "Contact Us",          view: 'contact'       as ViewType },
    { label: "My Orders",           view: 'my-orders'     as ViewType },
    { label: "Order Tracking",      view: 'order-tracking'as ViewType },
    { label: "AI Book Assistant",   view: 'ai-assistant'  as ViewType },
    { label: "Account Settings",    view: 'account'       as ViewType },
    { label: "Settings",            view: 'settings'      as ViewType },
  ];

  return (
    <footer className="bg-teal-900 dark:bg-[#021a17] text-teal-100 mt-auto">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 group mb-4">
              <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center group-hover:bg-teal-400 transition-colors">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white font-display">PaperNest</span>
              </div>
            </button>
            <p className="text-teal-300 text-sm leading-relaxed mb-5">
              Every Page Opens a New Possibility. Pakistan's premier intelligent bookstore and academic stationery marketplace.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-teal-400">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+92 42 111 727 376</span>
              </div>
              <div className="flex items-center gap-2 text-teal-400">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@papernest.pk</span>
              </div>
              <div className="flex items-center gap-2 text-teal-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Urdu Bazaar & Gulberg III, Lahore</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2.5">
              {shopLinks.map(l => (
                <li key={l.label}>
                  <button
                    onClick={() => setCurrentView(l.view)}
                    className="text-teal-300 hover:text-white text-sm transition-colors hover:translate-x-1 transform inline-block"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2.5">
              {categoryLinks.map(l => (
                <li key={l.label}>
                  <button
                    onClick={() => setCurrentView(l.view)}
                    className="text-teal-300 hover:text-white text-sm transition-colors hover:translate-x-1 transform inline-block"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Help & Account</h3>
            <ul className="space-y-2.5">
              {helpLinks.map(l => (
                <li key={l.label}>
                  <button
                    onClick={() => setCurrentView(l.view)}
                    className="text-teal-300 hover:text-white text-sm transition-colors hover:translate-x-1 transform inline-block"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Policies */}
            <div className="mt-5 pt-4 border-t border-teal-800">
              <p className="text-teal-500 text-xs font-medium mb-2 uppercase tracking-wider">Policies</p>
              {['Shipping Policy', 'Return & Refund', 'Privacy Policy'].map(p => (
                <p key={p} className="text-teal-400 hover:text-white text-xs cursor-pointer transition-colors mb-1.5">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-teal-800 dark:border-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-teal-500 text-xs text-center sm:text-left">
            © {year} PaperNest – Pakistan's AI-Powered Bookstore. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-teal-500 text-xs">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            <span>for readers across Pakistan</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-teal-500">Cash on Delivery Available</span>
            <span className="text-teal-700">•</span>
            <span className="text-teal-500">Free delivery above Rs. 2,500</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
