import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Send, 
  Bot, 
  Sparkles, 
  BookOpen, 
  ShoppingCart, 
  ArrowRight,
  Languages,
  BookCheck,
  GraduationCap,
  Compass,
  Gift,
  HelpCircle,
  Clock,
  CheckCircle2,
  Copy,
  RotateCcw
} from 'lucide-react';
import { ViewType, ChatMessage, Product } from '../types';
import { storageService } from '../services/storage';

interface AIAssistantPageProps {
  setCurrentView: (v: ViewType) => void;
  showProduct: (id: string) => void;
  showToast?: (msg: string, type?: 'success'|'error'|'info') => void;
  refreshCounts?: () => void;
}

type AIMode = 
  | 'chat'
  | 'matchmaker'
  | 'summarizer'
  | 'translator'
  | 'companion'
  | 'exam_tutor'
  | 'novel_discovery'
  | 'shopping'
  | 'gift_finder';

const AI_MODES: { id: AIMode; title: string; subtitle: string; icon: React.ElementType }[] = [
  { id: 'chat', title: 'AI Assistant', subtitle: 'General Bookstore Chat', icon: Bot },
  { id: 'matchmaker', title: 'Book Matchmaker', subtitle: 'Personalized Curation', icon: Sparkles },
  { id: 'summarizer', title: 'Book Summarizer', subtitle: 'Key Lessons & Synopsis', icon: BookCheck },
  { id: 'translator', title: 'Trilingual Translator', subtitle: 'Turkish · Urdu · English', icon: Languages },
  { id: 'companion', title: 'Reading Companion', subtitle: 'Pacing & Study Plans', icon: Clock },
  { id: 'exam_tutor', title: 'Exam Tutor', subtitle: 'CSS · MDCAT · LLB · IELTS', icon: GraduationCap },
  { id: 'novel_discovery', title: 'Novel Discovery', subtitle: 'Author & Genre Matching', icon: Compass },
  { id: 'shopping', title: 'Shopping Assistant', subtitle: 'Budget & Editions Advice', icon: ShoppingCart },
  { id: 'gift_finder', title: 'Gift Finder', subtitle: 'Age & Occasion Advisor', icon: Gift },
];

export default function AIAssistantPage({ 
  setCurrentView, 
  showProduct, 
  showToast, 
  refreshCounts 
}: AIAssistantPageProps) {
  const [activeMode, setActiveMode] = useState<AIMode>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      text: `Selam & Welcome to **PaperNest AI Studio**! 📚✨\n\nI am your intelligent literary advisor and academic tutor. I have direct access to our full catalog of **2,800+ authentic books**, including our new **Turkish Literature Collection** (Orhan Pamuk, Elif Shafak, Sabahattin Ali) and all 54 Pakistani education and literature categories.\n\nChoose an AI tool above or ask me anything below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Specialized Tool Form States
  // 1. Summarizer
  const [summaryQuery, setSummaryQuery] = useState('');
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  // 2. Translator
  const [translateText, setTranslateText] = useState('');
  const [fromLang, setFromLang] = useState<'Turkish' | 'English' | 'Urdu'>('Turkish');
  const [toLang, setToLang] = useState<'Turkish' | 'English' | 'Urdu'>('English');
  const [translationResult, setTranslationResult] = useState<string | null>(null);

  // 3. Exam Tutor
  const [examType, setExamType] = useState('CSS');
  const [examSubject, setExamSubject] = useState('Current Affairs');
  const [examQuiz, setExamQuiz] = useState<{ question: string; options: string[]; answer: number; explanation: string } | null>(null);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);

  // 4. Gift Finder
  const [giftAge, setGiftAge] = useState('Adult (25+)');
  const [giftInterest, setGiftInterest] = useState('History & Philosophy');
  const [giftBudget, setGiftBudget] = useState('Rs. 1,500 - 2,500');
  const [giftResult, setGiftResult] = useState<Product[]>([]);

  const products = useMemo(() => storageService.getProducts(), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Helper search
  const findCatalogProducts = (keywords: string[], limit = 4): Product[] => {
    return products
      .filter(p => keywords.some(kw =>
        p.name.toLowerCase().includes(kw.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(kw.toLowerCase()) ||
        p.authorName.toLowerCase().includes(kw.toLowerCase()) ||
        (p.originalTitle && p.originalTitle.toLowerCase().includes(kw.toLowerCase())) ||
        (p.englishTitle && p.englishTitle.toLowerCase().includes(kw.toLowerCase()))
      ))
      .slice(0, limit);
  };

  // Chat message send handler
  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const q = userText.toLowerCase();
      let reply = '';
      let recs: Product[] = [];

      if (q.includes('turkish') || q.includes('pamuk') || q.includes('shafak') || q.includes('madonna') || q.includes('turk')) {
        recs = findCatalogProducts(['turkish-books', 'pamuk', 'shafak', 'madonna', 'kemal', 'hikmet'], 4);
        reply = `🇹🇷 **PaperNest Turkish Collection**\n\nWe feature 54 verified Turkish literary masterpieces! Top highlights:\n• **Kürk Mantolu Madonna (Madonna in a Fur Coat)** by Sabahattin Ali – An iconic tale of unspoken devotion\n• **The Museum of Innocence & My Name is Red** by Nobel laureate Orhan Pamuk\n• **The Forty Rules of Love (Aşk)** by Elif Shafak\n\nAvailable in Turkish, English, and Urdu translations. Here are top recommended copies in stock:`;
      } else if (q.includes('css') || q.includes('pms') || q.includes('civil service')) {
        recs = findCatalogProducts(['css-prep', 'caravan', 'dogar', 'compulsory'], 4);
        reply = `🎯 **CSS & PMS Examination Guides**\n\nFor CSS 2026 aspirants, Caravan's compulsory manual and Dogar Brothers solved past papers provide comprehensive syllabus coverage for Essay, Pak Affairs, and English Précis.\n\nUse coupon code **CSS2026** for Rs. 500 off! Here are verified top picks:`;
      } else if (q.includes('mdcat') || q.includes('medical') || q.includes('biology')) {
        recs = findCatalogProducts(['mdcat-prep', 'biology', 'chemistry', 'kips'], 4);
        reply = `🩺 **MDCAT Preparation Resources**\n\nMaster your PMDC syllabus with conceptual high-yield question banks from KIPS Publications and Caravan Medical series. Here are top-rated books:`;
      } else if (q.includes('novel') || q.includes('fiction') || q.includes('peer-e-kamil') || q.includes('umera')) {
        recs = findCatalogProducts(['novel', 'umera', 'nimra', 'bano qudsia'], 4);
        reply = `📖 **Bestselling Novels & Fiction**\n\nOur fiction department offers deluxe hardbound editions of *Peer-e-Kamil*, *Aab-e-Hayat*, *Namal*, and *Raja Gidh*. Here are top reader favorites:`;
      } else if (q.includes('budget') || q.includes('cheap') || q.includes('under 1000') || q.includes('discount')) {
        recs = products.filter(p => (p.discountedPrice || p.price) <= 1000).slice(0, 4);
        reply = `💰 **Budget-Friendly Books Under Rs. 1,000**\n\nQuality literature should be accessible to all students. Here are top-rated volumes under Rs. 1,000 in crisp print editions:`;
      } else {
        recs = products.slice(0, 4);
        reply = `📚 **Personalized Catalog Recommendations**\n\nBased on your query, here are verified titles from our store matching your literary taste with guaranteed authentic publication quality:`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: recs
      };

      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 600);
  };

  // Summarizer Tool Action
  const handleGenerateSummary = () => {
    if (!summaryQuery.trim()) return;
    const q = summaryQuery.toLowerCase();
    
    if (q.includes('madonna') || q.includes('sabahattin')) {
      setSummaryResult(`📖 **Kürk Mantolu Madonna (Madonna in a Fur Coat)** by Sabahattin Ali\n\n• **Core Theme:** The tragedy of quiet isolation, emotional alienation, and the profound vulnerability of human love.\n• **Synopsis:** Raif Efendi, a quiet Turkish clerk in 1920s Berlin, discovers a portrait of Maria Puder in an art gallery. Their tender, fleeting relationship changes his life forever, leaving behind an immortal notebook of secret yearning.\n• **Key Lessons:**\n  1. The inner lives of ordinary people are infinitely richer than their outward silence.\n  2. Sincere emotional connection is rare and requires courage before circumstances intervene.\n• **Recommended Edition:** High-Quality Cream Paper, Turkish & English Bilingual.`);
    } else if (q.includes('forty rules') || q.includes('ask') || q.includes('shafak') || q.includes('rumi')) {
      setSummaryResult(`📖 **The Forty Rules of Love (Aşk)** by Elif Shafak\n\n• **Core Theme:** Spiritual awakening through selfless love; the transformative bond between Jalaluddin Rumi and Shams of Tabriz.\n• **Synopsis:** A parallel narrative following Ella Rubinstein, an unfulfilled modern suburbanite, and Aziz Zahara, an itinerant Sufi writer whose manuscript illuminates the 40 sacred spiritual rules of love and ego surrender.\n• **Key Lessons:**\n  1. Real wisdom is not book knowledge; it is shedding prejudices to open the heart.\n  2. The lover and the beloved are mirrored manifestations of the Divine.`);
    } else if (q.includes('peer') || q.includes('kamil') || q.includes('umera')) {
      setSummaryResult(`📖 **Peer-e-Kamil (S.A.W)** by Umera Ahmed\n\n• **Core Theme:** The divine journey from spiritual blindness to profound faith, repentance, and intellectual clarity.\n• **Synopsis:** The parallel life journeys of Imama Hashim, who sacrifices social status for the absolute truth of Islam, and Salar Sikandar, a genius with an IQ of 150+ tormented by existential emptiness until finding ultimate peace in the footsteps of the Holy Prophet (PBUH).\n• **Key Lessons:**\n  1. Intellect without moral faith breeds disillusionment.\n  2. Repentance is always accepted when sought with sincere submission.`);
    } else {
      setSummaryResult(`📖 **Comprehensive Synopsis for "${summaryQuery}"**\n\n• **Context:** Authoritative literary analysis based on PaperNest curriculum standards.\n• **Major Themes:** Intellectual integrity, moral self-determination, and personal excellence.\n• **Key Takeaways:** Explores essential character development, structured problem solving, and analytical depth for Pakistani students and scholars.`);
    }
  };

  // Translator Tool Action
  const handleTranslate = () => {
    if (!translateText.trim()) return;
    const text = translateText.trim().toLowerCase();

    if (fromLang === 'Turkish' && toLang === 'English') {
      if (text.includes('kürk mantolu madonna')) {
        setTranslationResult('Madonna in a Fur Coat (Literary translation by Maureen Freely & Alexander Dawe)');
      } else if (text.includes('aşk')) {
        setTranslationResult('The Forty Rules of Love (Original title: Aşk - Love in Sufi terminology)');
      } else if (text.includes('benim adım kırmızı')) {
        setTranslationResult('My Name is Red (Historical novel set in 16th-century Ottoman Istanbul)');
      } else {
        setTranslationResult(`English Translation: "${translateText}" — Faithfully translated following standard Ottoman & modern Turkish grammatical structures.`);
      }
    } else if (fromLang === 'Turkish' && toLang === 'Urdu') {
      if (text.includes('kürk mantolu madonna')) {
        setTranslationResult('فر کوٹ والی مڈونا (ترک ادب کا شاہکار ناول از صباح الدین علی)');
      } else if (text.includes('aşk')) {
        setTranslationResult('چالیس قواعدِ عشق (رومی اور شمس تبریز کی روحانی داستان از الف شفق)');
      } else {
        setTranslationResult(`اردو ترجمہ: "${translateText}" — جدید ترکی اور اردو ادب کے باہمی اشتراک پر مبنی معیاری ترجمہ۔`);
      }
    } else {
      setTranslationResult(`Direct literary translation from ${fromLang} to ${toLang}: "${translateText}"`);
    }
  };

  // Exam Tutor Action
  const handleLoadExamQuestion = () => {
    if (examType === 'CSS') {
      setExamQuiz({
        question: 'Which constitutional amendment in Pakistan established the National Finance Commission (NFC) Award provincial autonomy framework?',
        options: ['17th Amendment', '18th Amendment (2010)', '19th Amendment', '21st Amendment'],
        answer: 1,
        explanation: 'The 18th Constitutional Amendment passed in April 2010 devolved 47 subjects to provinces and amended Article 160(3A) ensuring provincial shares in NFC awards cannot decrease.'
      });
    } else if (examType === 'MDCAT') {
      setExamQuiz({
        question: 'Which organelle is responsible for post-translational modification and sorting of secretory proteins in eukaryotic cells?',
        options: ['Mitochondria', 'Golgi Apparatus', 'Peroxisome', 'Smooth Endoplasmic Reticulum'],
        answer: 1,
        explanation: 'The Golgi Apparatus receives proteins from the Rough ER, modifies them (glycosylation), and sorts them into vesicles for secretion.'
      });
    } else if (examType === 'LLB') {
      setExamQuiz({
        question: 'Under Section 300 of the Pakistan Penal Code (PPC), intentional killing with premeditation is classified as:',
        options: ['Qatl-i-Khata', 'Qatl-i-Amd', 'Qatl-i-Shibh-i-Amd', 'Qatl-bis-Sabab'],
        answer: 1,
        explanation: 'Section 300 of the PPC defines Qatl-i-Amd as causing death with the intention of causing death or bodily injury likely to cause death.'
      });
    } else {
      setExamQuiz({
        question: 'In IELTS Academic Writing Task 1, which structure is required to describe trends over time?',
        options: ['Giving personal opinions', 'Overview + Key Trends + Specific Data comparisons', 'Informal bullet points', 'A rhetorical question'],
        answer: 1,
        explanation: 'A Band 8+ response must feature an Overview highlighting principal highs/lows, followed by cohesive body paragraphs grouping trends.'
      });
    }
    setQuizSelected(null);
  };

  // Gift Finder Action
  const handleFindGift = () => {
    if (giftInterest.includes('History')) {
      setGiftResult(findCatalogProducts(['history', 'pakistan affairs', 'ottoman', 'tanpinar'], 3));
    } else if (giftInterest.includes('Novel') || giftInterest.includes('Fiction')) {
      setGiftResult(findCatalogProducts(['novel', 'madonna', 'peer-e-kamil'], 3));
    } else {
      setGiftResult(findCatalogProducts(['leadership', 'atomic habits', 'philosophy'], 3));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </span>
            <h1 className="text-3xl font-black text-teal-900 dark:text-teal-100 font-display">
              PaperNest AI Multilingual Suite
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Intelligent book recommendation engine, exam tutor & trilingual translation studio
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Catalog Engine (2,800+ Books)
          </span>
        </div>
      </div>

      {/* 8 AI Modes Tab Bar */}
      <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-3xl p-3 shadow-sm overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {AI_MODES.map(mode => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-[#04241e] text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-teal-600 dark:text-teal-400'}`} />
                <div className="text-left">
                  <div className="leading-tight">{mode.title}</div>
                  <div className={`text-[10px] font-normal ${isActive ? 'text-teal-200' : 'text-slate-400'}`}>
                    {mode.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN TOOL VIEW BASED ON ACTIVE MODE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Tool Canvas */}
        <div className="lg:col-span-2 space-y-6">
          {/* MODE 1: CHAT & MATCHMAKER */}
          {(activeMode === 'chat' || activeMode === 'matchmaker' || activeMode === 'novel_discovery' || activeMode === 'shopping') && (
            <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-3xl p-5 shadow-sm flex flex-col h-[600px]">
              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-teal-700 text-white rounded-br-none shadow-xs'
                        : 'bg-slate-50 dark:bg-[#04241e] text-slate-800 dark:text-teal-50 rounded-bl-none border border-teal-50 dark:border-teal-900/40 shadow-xs'
                    }`}>
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* Attached Product Recommendations */}
                      {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-teal-900/60 space-y-2">
                          <div className="text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
                            Direct Catalog Matches:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.recommendedProducts.map(p => (
                              <div 
                                key={p.id}
                                onClick={() => showProduct(p.id)}
                                className="p-2 rounded-xl bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900 cursor-pointer hover:shadow-xs transition-shadow flex items-center gap-2 group"
                              >
                                <img src={p.coverImage} alt="" className="w-8 h-11 object-cover rounded bg-teal-50" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-slate-800 dark:text-teal-100 truncate group-hover:text-teal-700 dark:group-hover:text-teal-300">
                                    {p.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">{p.authorName}</div>
                                  <div className="text-[11px] font-black text-teal-700 dark:text-teal-300">
                                    Rs. {(p.discountedPrice || p.price).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-[10px] text-right mt-1.5 opacity-60">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3 items-center text-xs text-slate-400">
                    <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span>Consulting PaperNest Catalog & Literary Index...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="pt-3 border-t border-teal-100 dark:border-teal-900/60">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      activeMode === 'matchmaker'
                        ? 'Describe your favorite authors or mood (e.g. Loved Orhan Pamuk, want similar books)...'
                        : activeMode === 'shopping'
                        ? 'Ask for budget recommendations (e.g. Best law books under Rs. 2,000)...'
                        : 'Ask PaperNest AI about books, exams, Turkish classics, or authors...'
                    }
                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-[#04241e] border border-teal-100 dark:border-teal-900 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-teal-100 placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="px-5 py-3 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-2xl font-bold transition-colors flex items-center gap-1.5 shadow-sm text-xs sm:text-sm"
                  >
                    <span>Send</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* MODE 2: SUMMARIZER */}
          {activeMode === 'summarizer' && (
            <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-3xl p-6 shadow-sm space-y-5">
              <div>
                <h3 className="text-lg font-bold text-teal-900 dark:text-teal-100 font-display">
                  AI Book Summarizer & Synopsis Generator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter any book from our catalog to generate an instant executive summary, core philosophical lessons, and reader takeaways.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter book title (e.g. Kürk Mantolu Madonna, Peer-e-Kamil, The Forty Rules of Love)..."
                  value={summaryQuery}
                  onChange={(e) => setSummaryQuery(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-[#04241e] border border-teal-100 dark:border-teal-900 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleGenerateSummary}
                  className="px-5 py-3 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800 transition-colors"
                >
                  Generate Summary
                </button>
              </div>

              {summaryResult && (
                <div className="p-5 rounded-2xl bg-teal-50/60 dark:bg-[#04241e] border border-teal-100 dark:border-teal-900/60 text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-800 dark:text-teal-100 shadow-xs">
                  {summaryResult}
                </div>
              )}
            </div>
          )}

          {/* MODE 3: TRILINGUAL TRANSLATOR */}
          {activeMode === 'translator' && (
            <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-3xl p-6 shadow-sm space-y-5">
              <div>
                <h3 className="text-lg font-bold text-teal-900 dark:text-teal-100 font-display">
                  Trilingual Literary Translator (Turkish · Urdu · English)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Translate passages, book titles, and famous quotes between Turkish, English, and Urdu with cultural annotations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">From:</label>
                  <select
                    value={fromLang}
                    onChange={(e) => setFromLang(e.target.value as any)}
                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-[#04241e] border rounded-xl text-xs font-bold"
                  >
                    <option value="Turkish">Turkish (Türkçe)</option>
                    <option value="English">English</option>
                    <option value="Urdu">Urdu (اردو)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">To:</label>
                  <select
                    value={toLang}
                    onChange={(e) => setToLang(e.target.value as any)}
                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-[#04241e] border rounded-xl text-xs font-bold"
                  >
                    <option value="English">English</option>
                    <option value="Urdu">Urdu (اردو)</option>
                    <option value="Turkish">Turkish (Türkçe)</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={4}
                value={translateText}
                onChange={(e) => setTranslateText(e.target.value)}
                placeholder="Paste Turkish or English excerpt to translate (e.g. Kürk Mantolu Madonna, Aşk, Hayat Güzeldir)..."
                className="w-full p-4 bg-slate-50 dark:bg-[#04241e] border border-teal-100 dark:border-teal-900 rounded-2xl text-xs focus:ring-2 focus:ring-teal-500"
              />

              <button
                onClick={handleTranslate}
                className="px-6 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800 transition-colors"
              >
                Translate Excerpt
              </button>

              {translationResult && (
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-[#04241e] border border-teal-200 dark:border-teal-800 text-xs sm:text-sm font-medium">
                  {translationResult}
                </div>
              )}
            </div>
          )}

          {/* MODE 5: EXAM TUTOR */}
          {activeMode === 'exam_tutor' && (
            <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-3xl p-6 shadow-sm space-y-5">
              <div>
                <h3 className="text-lg font-bold text-teal-900 dark:text-teal-100 font-display">
                  AI Competitive Exam Tutor
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Practice simulated questions for CSS, MDCAT, LLB, and IELTS with instant analytical explanations.
                </p>
              </div>

              <div className="flex gap-3">
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="px-4 py-2.5 bg-slate-50 dark:bg-[#04241e] border rounded-xl text-xs font-bold"
                >
                  <option value="CSS">CSS Preparation (Compulsory)</option>
                  <option value="MDCAT">MDCAT Medical Admission</option>
                  <option value="LLB">LLB & Law (PPC/Constitution)</option>
                  <option value="IELTS">IELTS Academic English</option>
                </select>

                <button
                  onClick={handleLoadExamQuestion}
                  className="px-5 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800 transition-colors"
                >
                  Generate Practice Question
                </button>
              </div>

              {examQuiz && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#04241e] border border-teal-100 dark:border-teal-900/40 space-y-4">
                  <div className="text-xs font-extrabold text-teal-900 dark:text-teal-100 leading-relaxed">
                    {examQuiz.question}
                  </div>

                  <div className="space-y-2">
                    {examQuiz.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuizSelected(idx)}
                        className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all border ${
                          quizSelected === idx
                            ? idx === examQuiz.answer
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100'
                              : 'bg-rose-100 border-rose-500 text-rose-900'
                            : 'bg-white dark:bg-[#063028] border-slate-200 dark:border-teal-900'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {quizSelected !== null && (
                    <div className="p-3 rounded-xl bg-teal-100/50 dark:bg-teal-950/60 text-xs leading-relaxed text-teal-900 dark:text-teal-200">
                      <strong>Explanation:</strong> {examQuiz.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MODE 8: GIFT FINDER */}
          {activeMode === 'gift_finder' && (
            <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-3xl p-6 shadow-sm space-y-5">
              <div>
                <h3 className="text-lg font-bold text-teal-900 dark:text-teal-100 font-display">
                  AI Book Gift Advisor
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select the recipient's age, interests, and budget to receive curated gift set suggestions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Age Group:</label>
                  <select
                    value={giftAge}
                    onChange={(e) => setGiftAge(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-[#04241e] border rounded-xl text-xs font-bold"
                  >
                    <option value="Kids (5-8)">Kids (5–8)</option>
                    <option value="Teens (13-17)">Teenagers (13–17)</option>
                    <option value="Adult (25+)">Adults & Scholars (25+)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Interest:</label>
                  <select
                    value={giftInterest}
                    onChange={(e) => setGiftInterest(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-[#04241e] border rounded-xl text-xs font-bold"
                  >
                    <option value="History & Philosophy">History & Ottoman Classics</option>
                    <option value="Novels & Fiction">Emotional & Spiritual Fiction</option>
                    <option value="Self Development">Leadership & Habits</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Budget:</label>
                  <select
                    value={giftBudget}
                    onChange={(e) => setGiftBudget(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-[#04241e] border rounded-xl text-xs font-bold"
                  >
                    <option value="Under Rs. 1,500">Under Rs. 1,500</option>
                    <option value="Rs. 1,500 - 2,500">Rs. 1,500 - 2,500</option>
                    <option value="Above Rs. 2,500">Above Rs. 2,500</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleFindGift}
                className="px-6 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800 transition-colors"
              >
                Find Best Book Gifts
              </button>

              {giftResult.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {giftResult.map(b => (
                    <div 
                      key={b.id}
                      onClick={() => showProduct(b.id)}
                      className="p-3 bg-teal-50/50 dark:bg-[#04241e] rounded-xl border border-teal-100 dark:border-teal-900 cursor-pointer hover:shadow-xs"
                    >
                      <img src={b.coverImage} alt="" className="aspect-[3/4] object-cover rounded-lg mb-2" />
                      <div className="text-xs font-bold text-slate-800 dark:text-teal-100 line-clamp-1">{b.name}</div>
                      <div className="text-[11px] text-teal-700 dark:text-teal-300 font-black mt-1">
                        Rs. {(b.discountedPrice || b.price).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MODE 4: READING COMPANION */}
          {activeMode === 'companion' && (
            <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-3xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-bold text-teal-900 dark:text-teal-100 font-display">
                  AI Reading Companion & Study Pacing
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Generate realistic daily reading schedules to finish any volume or exam book within 14 or 30 days.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-[#04241e] border border-teal-100 dark:border-teal-900/40 text-xs leading-relaxed space-y-2">
                <div className="font-bold text-teal-900 dark:text-teal-100">
                  Recommended Pace: *Kürk Mantolu Madonna* (180 Pages)
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  • <strong>Daily Target:</strong> 12 pages / day (15 minutes reading)<br />
                  • <strong>Finish Date:</strong> Exactly 15 days from today<br />
                  • <strong>Milestone:</strong> Finish Chapter 5 by this Sunday for optimal reflection.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Inspiration Chips & AI Capabilities Guide */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#063028] border border-teal-100 dark:border-teal-900/60 rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Quick Suggestions
            </h3>
            <div className="space-y-1.5">
              {[
                'Recommend top Turkish literature books',
                'Best books for CSS 2026 Compulsory',
                'Orhan Pamuk Nobel Prize masterworks',
                'Books under Rs. 1,000 for university students',
                'Summarize Madonna in a Fur Coat',
                'MDCAT Biology question bank guides'
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(query);
                    setActiveMode('chat');
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 dark:bg-[#04241e] dark:hover:bg-teal-900/40 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors border border-transparent hover:border-teal-200"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-800 to-emerald-950 text-white shadow-md space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Direct Store Integration
            </h3>
            <p className="text-xs text-teal-100/90 leading-relaxed">
              PaperNest AI answers queries directly from our inventory and verified publisher relationships, guaranteeing accurate pricing, authentic ISBNs, and immediate availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
