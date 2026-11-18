import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, MessageCircle, Send, CheckCircle,
  HelpCircle, ChevronDown, ChevronUp, Shield, Truck, RefreshCw, ArrowLeft
} from 'lucide-react';
import { ViewType } from '../types';

interface ContactPageProps {
  setCurrentView: (v: ViewType) => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const FAQS = [
  {
    q: 'How long does nationwide book delivery take in Pakistan?',
    a: 'We deliver within 2 to 4 business days across major cities (Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Quetta, Multan, Faisalabad). Remote districts typically arrive within 4 to 6 business days via TCS and Leopards Courier.'
  },
  {
    q: 'What is the Cash on Delivery (COD) policy?',
    a: 'Cash on Delivery is available across all 150+ Pakistani cities and towns with zero extra surcharge. You only pay the exact invoice total upon receiving your parcel from the courier rider.'
  },
  {
    q: 'What is your 7-Day Return and Replacement Policy?',
    a: 'If any book or stationery item has missing pages, printing defects, or arrived damaged, simply contact us via WhatsApp (+92 300 7273761) within 7 days. We provide a 100% free doorstep replacement or full refund.'
  },
  {
    q: 'Are your CSS and competitive exam books up-to-date for 2026?',
    a: 'Yes, all Caravan, Dogar Brothers, and KIPS publications in our exam preparation category are strictly updated per the latest FPSC, PPSC, PMDC, and UET syllabi for the 2026 examination cycle.'
  },
  {
    q: 'Do you offer bulk discounts for educational institutions?',
    a: 'Yes! Schools, colleges, universities, and civil service coaching academies can request institutional discount rates by contacting our corporate desk at support@papernest.pk.'
  }
];

export default function ContactPage({ setCurrentView, showToast }: ContactPageProps) {
  const [activeTab, setActiveTab] = useState<'contact' | 'policies'>('contact');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (showToast) showToast('Thank you! Your message has been sent. We will reply shortly.', 'success');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentView('home')}
          className="p-2 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-800 dark:text-teal-200 font-display">Contact & Help Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Customer care hotline, policies, and frequently asked questions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-teal-100 dark:border-teal-900 pb-3">
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'contact'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40'
          }`}
        >
          <MessageCircle className="w-4 h-4" /> Contact Us & Support
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'policies'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40'
          }`}
        >
          <Shield className="w-4 h-4" /> Store Policies & Guarantee
        </button>
      </div>

      {activeTab === 'contact' ? (
        <div className="space-y-10">
          {/* Contact Details & Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-5 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-teal-100">Customer Support Desk</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Available Monday to Saturday, 9:00 AM – 8:00 PM PST</p>
                <p className="text-sm font-bold text-teal-700 dark:text-teal-300">+92 42 111 727 376</p>
              </div>

              <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-5 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-teal-100">WhatsApp Instant Ordering</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Send book titles or pictures for immediate confirmation</p>
                <a
                  href="https://wa.me/923007273761"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  +92 300 7273761 (Chat on WhatsApp) →
                </a>
              </div>

              <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-5 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-teal-100">Lahore Experience Centers</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>Urdu Bazaar:</strong> Shop 14, Kitab Market, Lahore<br />
                  <strong>Gulberg:</strong> 2nd Floor, Siddiq Trade Centre, Gulberg III, Lahore
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-teal-800 dark:text-teal-200 mb-2 font-display">Send us an Inquiry</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Have questions regarding rare books, syllabus inquiries, or bulk orders? Fill out the form below.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-teal-50 dark:bg-teal-900/40 rounded-xl border border-teal-200 dark:border-teal-800 space-y-3">
                  <CheckCircle className="w-12 h-12 text-teal-600 dark:text-teal-400 mx-auto" />
                  <h3 className="text-lg font-bold text-teal-800 dark:text-teal-200">Message Received!</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Our academic consultant will respond to <strong>{form.email}</strong> within 3 business hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name:'', email:'', phone:'', subject:'', message:'' }); }}
                    className="mt-3 px-5 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Your Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Fatima Tariq"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Email Address *</label>
                      <input
                        required
                        type="email"
                        placeholder="fatima@example.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="+92 300 1234567"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Subject</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Inquiring about CSS 2026 optional syllabus"
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please specify book titles, authors, or queries in detail…"
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-transparent text-sm text-slate-800 dark:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-teal-800 dark:text-teal-200 mb-6 font-display">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-teal-100 dark:border-teal-900 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-sm text-slate-800 dark:text-teal-100 hover:bg-teal-50/50 dark:hover:bg-teal-900/30 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-teal-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-teal-50/30 dark:bg-teal-950/20 border-t border-teal-50 dark:border-teal-900 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Store Policies Section */
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              <h2 className="text-lg font-bold text-teal-800 dark:text-teal-200">1. Shipping & Delivery Policy</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              PaperNest delivers physical publications nationwide across Pakistan. We package every order with protective bubble insulation and water-resistant sleeves. Orders confirmed before 3:00 PM PST are dispatched on the same business day via TCS or Leopards Courier. Standard shipping is Rs. 150, and all orders over Rs. 2,500 automatically receive 100% Free Shipping.
            </p>
          </div>

          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-bold text-teal-800 dark:text-teal-200">2. 7-Day Hassle-Free Returns & Replacements</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Customer satisfaction is our highest commitment. If you receive an erroneous edition, misbound pages, or damaged covers, our rider will pick up the parcel from your address and exchange it at zero extra charge. Refunds for verified claims are remitted within 5 working days via Bank Transfer, JazzCash, or EasyPaisa.
            </p>
          </div>

          <div className="bg-white dark:bg-[#063028] rounded-2xl border border-teal-100 dark:border-teal-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              <h2 className="text-lg font-bold text-teal-800 dark:text-teal-200">3. Privacy & Customer Data Protection</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              PaperNest never sells or rents personal customer information to third parties. Customer contact details, addresses, and purchase histories are strictly utilized for delivery dispatch and warranty tracking.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
