import React, { useState } from 'react';
import { ViewType } from '../types';
import ShopPage from './ShopPage';

interface CategoryShopProps {
  categoryId: string;
  pageTitle: string;
  pageDescription: string;
  setCurrentView: (v: ViewType) => void;
  showProduct: (id: string) => void;
  showToast?: (msg: string, type?: 'success'|'error'|'info') => void;
  refreshCounts?: () => void;
}

function CategoryShop({ categoryId, pageTitle, pageDescription, setCurrentView, showProduct, showToast, refreshCounts }: CategoryShopProps) {
  return (
    <ShopPage
      setCurrentView={setCurrentView}
      showProduct={showProduct}
      showToast={showToast}
      refreshCounts={refreshCounts}
      initialCategory={categoryId}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
    />
  );
}

// ─── Library ─────────────────────────────────────────────────────────────────
export function LibraryPage({ setCurrentView, showProduct, showToast, refreshCounts }: Omit<CategoryShopProps, 'categoryId'|'pageTitle'|'pageDescription'>) {
  const [tab, setTab] = useState('');
  const eduLevels = [
    { id: '',           label: 'All Books'     },
    { id: 'school',     label: 'School'        },
    { id: 'college',    label: 'College'       },
    { id: 'university', label: 'University'    },
    { id: 'graduation', label: 'Graduation'    },
    { id: 'postgraduate',label:'Postgraduate'  },
  ];
  return (
    <div>
      <div className="bg-white dark:bg-[#063028] border-b border-teal-100 dark:border-teal-900 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1">
          {eduLevels.map(l => (
            <button key={l.id} onClick={() => setTab(l.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === l.id ? 'bg-teal-600 text-white' : 'bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-800'}`}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <ShopPage setCurrentView={setCurrentView} showProduct={showProduct} showToast={showToast} refreshCounts={refreshCounts}
        initialCategory={tab} pageTitle="Books Library" pageDescription="Browse our complete academic and general book collection across all education levels." />
    </div>
  );
}

// ─── Newspapers ───────────────────────────────────────────────────────────────
export function NewspapersPage(props: Omit<CategoryShopProps,'categoryId'|'pageTitle'|'pageDescription'>) {
  return <CategoryShop {...props} categoryId="newspapers" pageTitle="Newspapers & Magazines" pageDescription="Daily newspapers, weekly gazettes, monthly magazines, and current affairs digests." />;
}

// ─── Novels ───────────────────────────────────────────────────────────────────
export function NovelsPage(props: Omit<CategoryShopProps,'categoryId'|'pageTitle'|'pageDescription'>) {
  return <CategoryShop {...props} categoryId="novels" pageTitle="Novels & Fiction" pageDescription="Bestselling Urdu and English novels, fiction, social drama, psychological thrillers, and classics." />;
}

// ─── Ideological ─────────────────────────────────────────────────────────────
export function IdeologicalPage(props: Omit<CategoryShopProps,'categoryId'|'pageTitle'|'pageDescription'>) {
  return <CategoryShop {...props} categoryId="ideological-political" pageTitle="Ideological & Political Books" pageDescription="Political thought, constitutional history, geopolitics, statecraft, and national ideological literature." />;
}

// ─── Academic ────────────────────────────────────────────────────────────────
export function AcademicPage({ setCurrentView, showProduct, showToast, refreshCounts }: Omit<CategoryShopProps,'categoryId'|'pageTitle'|'pageDescription'>) {
  const [tab, setTab] = useState('university');
  const levels = [
    { id: 'school',      label: 'School'       },
    { id: 'college',     label: 'College'      },
    { id: 'university',  label: 'University'   },
    { id: 'graduation',  label: 'Graduation'   },
    { id: 'postgraduate',label: 'Postgraduate' },
  ];
  return (
    <div>
      <div className="bg-white dark:bg-[#063028] border-b border-teal-100 dark:border-teal-900 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1">
          {levels.map(l => (
            <button key={l.id} onClick={() => setTab(l.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === l.id ? 'bg-teal-600 text-white' : 'bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-800'}`}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <ShopPage setCurrentView={setCurrentView} showProduct={showProduct} showToast={showToast} refreshCounts={refreshCounts}
        initialCategory={tab} pageTitle="Academic Textbooks" pageDescription="Official syllabi textbooks and reference books for all education levels in Pakistan." />
    </div>
  );
}

// ─── Stationery ───────────────────────────────────────────────────────────────
export function StationeryPage(props: Omit<CategoryShopProps,'categoryId'|'pageTitle'|'pageDescription'>) {
  return <CategoryShop {...props} categoryId="stationery" pageTitle="Stationery & Academic Supplies" pageDescription="Registers, notebooks, pens, fountain pens, highlighters, art supplies, geometry sets, and student kits." />;
}

// ─── Exam Prep ────────────────────────────────────────────────────────────────
export function ExamPrepPage({ setCurrentView, showProduct, showToast, refreshCounts }: Omit<CategoryShopProps,'categoryId'|'pageTitle'|'pageDescription'>) {
  const [tab, setTab] = useState('css-prep');
  const exams = [
    { id: 'css-prep',      label: 'CSS'      },
    { id: 'mdcat-prep',    label: 'MDCAT'    },
    { id: 'ecat-prep',     label: 'ECAT'     },
    { id: 'lat-prep',      label: 'LAT'      },
    { id: 'llb-books',     label: 'LLB'      },
    { id: 'general-entry', label: 'NTS/GAT'  },
    { id: 'competitive-exams', label: 'PMS/FPSC' },
  ];
  return (
    <div>
      <div className="bg-white dark:bg-[#063028] border-b border-teal-100 dark:border-teal-900 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1">
          {exams.map(e => (
            <button key={e.id} onClick={() => setTab(e.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === e.id ? 'bg-teal-600 text-white' : 'bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-800'}`}>
              {e.label}
            </button>
          ))}
        </div>
      </div>
      <ShopPage setCurrentView={setCurrentView} showProduct={showProduct} showToast={showToast} refreshCounts={refreshCounts}
        initialCategory={tab} pageTitle="Exam Preparation Books" pageDescription="Gold-standard preparation resources for CSS, MDCAT, ECAT, LAT, LLB, NTS, PMS, and FPSC." />
    </div>
  );
}

export default LibraryPage;
