import { Product, InventoryItem, Author, Publisher, PaperQuality, Review, Order, OrderItem } from '../types';
import { CATEGORIES } from './categoriesData';

export const AUTHORS: Author[] = [
  { id: 'auth-1', name: 'Faiz Ahmad Faiz', slug: 'faiz-ahmad-faiz', bio: 'Renowned revolutionary Urdu poet, Lenin Peace Prize laureate.', country: 'Pakistan', birthYear: 1911 },
  { id: 'auth-2', name: 'Allama Muhammad Iqbal', slug: 'allama-muhammad-iqbal', bio: 'National poet-philosopher of Pakistan, author of Asrar-e-Khudi and Bang-e-Dra.', country: 'Pakistan', birthYear: 1877 },
  { id: 'auth-3', name: 'Umera Ahmed', slug: 'umera-ahmed', bio: 'Leading contemporary Urdu fiction novelist, author of Peer-e-Kamil, Amar Bail, and Alif.', country: 'Pakistan', birthYear: 1976 },
  { id: 'auth-4', name: 'Nimra Ahmed', slug: 'nimra-ahmed', bio: 'Bestselling author of Namal, Jannat Kay Pattay, Mushaf, and Haalim.', country: 'Pakistan', birthYear: 1990 },
  { id: 'auth-5', name: 'Saadat Hasan Manto', slug: 'saadat-hasan-manto', bio: 'Greatest 20th-century short story master of the Subcontinent.', country: 'Pakistan', birthYear: 1912 },
  { id: 'auth-6', name: 'Stephen Hawking', slug: 'stephen-hawking', bio: 'Theoretical physicist and cosmologist, author of A Brief History of Time.', country: 'United Kingdom', birthYear: 1942 },
  { id: 'auth-7', name: 'Dr. Ishtiaq Ahmed', slug: 'dr-ishtiaq-ahmed', bio: 'Renowned political scientist and historian, author of The Punjab Bloodied and Partitioned.', country: 'Sweden / Pakistan', birthYear: 1947 },
  { id: 'auth-8', name: 'Ayesha Jalal', slug: 'ayesha-jalal', bio: 'MacArthur Fellow, Mary Richardson Professor of History at Tufts University.', country: 'Pakistan', birthYear: 1956 },
  { id: 'auth-9', name: 'Dogar Brothers Editorial Board', slug: 'dogar-editorial', bio: 'Premier competitive exam publication authority in Pakistan since 1949.', country: 'Pakistan', birthYear: 1949 },
  { id: 'auth-10', name: 'Caravan Research Panel', slug: 'caravan-research', bio: 'Specialist civil service examination researchers and textbook authors.', country: 'Pakistan', birthYear: 1965 },
  { id: 'auth-11', name: 'Thomas H. Cormen', slug: 'thomas-h-cormen', bio: 'Co-author of Introduction to Algorithms (CLRS), Dartmouth Professor.', country: 'United States', birthYear: 1956 },
  { id: 'auth-12', name: 'David Halliday & Robert Resnick', slug: 'halliday-resnick', bio: 'Pioneers in fundamental physics university textbooks.', country: 'United States', birthYear: 1916 },
  { id: 'auth-13', name: 'George Orwell', slug: 'george-orwell', bio: 'English novelist and essayist, author of 1984 and Animal Farm.', country: 'United Kingdom', birthYear: 1903 },
  { id: 'auth-14', name: 'Bapsi Sidhwa', slug: 'bapsi-sidhwa', bio: 'Celebrated Pakistani novelist, author of Ice Candy Man (Cracking India).', country: 'Pakistan', birthYear: 1938 },
  { id: 'auth-15', name: 'Ahmed Rashid', slug: 'ahmed-rashid', bio: 'Renowned journalist and author of Taliban and Descent into Chaos.', country: 'Pakistan', birthYear: 1948 },
  { id: 'auth-16', name: 'James Clear', slug: 'james-clear', bio: 'Author of the #1 New York Times bestseller Atomic Habits.', country: 'United States', birthYear: 1986 },
  { id: 'auth-17', name: 'Agatha Christie', slug: 'agatha-christie', bio: 'World-famous detective mystery novelist, creator of Hercule Poirot.', country: 'United Kingdom', birthYear: 1890 },
  { id: 'auth-18', name: 'Ibn-e-Safi', slug: 'ibn-e-safi', bio: 'Legendary creator of the Imran Series and Jasoosi Dunya Urdu mystery novels.', country: 'Pakistan', birthYear: 1928 },
  
  // Renowned Turkish Authors
  { id: 'auth-tr-1', name: 'Orhan Pamuk', slug: 'orhan-pamuk', bio: 'Nobel Prize in Literature laureate (2006), acclaimed author of My Name is Red, Snow, and The Museum of Innocence.', country: 'Turkey', birthYear: 1952 },
  { id: 'auth-tr-2', name: 'Elif Shafak', slug: 'elif-shafak', bio: 'Internationally acclaimed Turkish-British novelist, author of The Forty Rules of Love, The Bastard of Istanbul, and The Island of Missing Trees.', country: 'Turkey', birthYear: 1971 },
  { id: 'auth-tr-3', name: 'Sabahattin Ali', slug: 'sabahattin-ali', bio: 'Celebrated Turkish novelist and poet, master of human emotion, author of Madonna in a Fur Coat and Yusuf of Kuyucak.', country: 'Turkey', birthYear: 1907 },
  { id: 'auth-tr-4', name: 'Yaşar Kemal', slug: 'yasar-kemal', bio: 'Grand master of Anatolian epic literature, Nobel Prize nominee, author of Memed, My Hawk (İnce Memed).', country: 'Turkey', birthYear: 1923 },
  { id: 'auth-tr-5', name: 'Nazım Hikmet', slug: 'nazim-hikmet', bio: 'World-renowned Turkish romantic-revolutionary lyrical poet, author of Human Landscapes from My Country.', country: 'Turkey', birthYear: 1902 },
  { id: 'auth-tr-6', name: 'Ahmet Hamdi Tanpınar', slug: 'ahmet-hamdi-tanpinar', bio: 'Pioneering Turkish modern novelist and scholar, author of The Time Regulation Institute and A Mind at Peace.', country: 'Turkey', birthYear: 1901 },
  { id: 'auth-tr-7', name: 'Reşat Nuri Güntekin', slug: 'resat-nuri-guntekin', bio: 'Master of Turkish social realism and emotional classics, author of Çalıkuşu (The Wren) and The Stigma.', country: 'Turkey', birthYear: 1889 },
  { id: 'auth-tr-8', name: 'Aziz Nesin', slug: 'aziz-nesin', bio: 'Legendary Turkish humorist, satirist, and prolific humanist author of over 100 books.', country: 'Turkey', birthYear: 1915 },
  { id: 'auth-tr-9', name: 'Halide Edip Adıvar', slug: 'halide-edip-adivar', bio: 'Pioneering Turkish female author, philosopher, and leader in the Turkish War of Independence, author of The Shirt of Flame.', country: 'Turkey', birthYear: 1884 },
  { id: 'auth-tr-10', name: 'Oğuz Atay', slug: 'oguz-atay', bio: 'Pioneer of Turkish postmodernism and intellectual depth, author of Tutunamayanlar (The Disconnected).', country: 'Turkey', birthYear: 1934 },
  { id: 'auth-tr-11', name: 'Sait Faik Abasıyanık', slug: 'sait-faik', bio: 'Premier short story master portraying the daily life and human soul of Istanbul, author of The Samovar.', country: 'Turkey', birthYear: 1906 },
  { id: 'auth-tr-12', name: 'Peyami Safa', slug: 'peyami-safa', bio: 'Master of psychological fiction and Turkish cultural synthesis, author of Dokuzuncu Hariciye Koğuşu.', country: 'Turkey', birthYear: 1899 },
];

export const PUBLISHERS: Publisher[] = [
  { id: 'pub-1', name: 'Oxford University Press Pakistan', slug: 'oup-pakistan', country: 'Pakistan', website: 'https://oup.com.pk' },
  { id: 'pub-2', name: 'Caravan Book House Lahore', slug: 'caravan-books', country: 'Pakistan', website: 'https://caravanbooks.biz' },
  { id: 'pub-3', name: 'Dogar Brothers Publishers', slug: 'dogar-publishers', country: 'Pakistan', website: 'https://dogar.com.pk' },
  { id: 'pub-4', name: 'Ilmi Kitab Khana Urdu Bazaar', slug: 'ilmi-kitab-khana', country: 'Pakistan', website: 'https://ilmikitabkhana.com' },
  { id: 'pub-5', name: 'Sang-e-Meel Publications', slug: 'sange-meel', country: 'Pakistan', website: 'https://sangemeel.com' },
  { id: 'pub-6', name: 'Ferozsons Pakistan', slug: 'ferozsons', country: 'Pakistan', website: 'https://ferozsons.com.pk' },
  { id: 'pub-7', name: 'KIPS Publications', slug: 'kips-publications', country: 'Pakistan', website: 'https://kipspublications.com' },
  { id: 'pub-8', name: 'Daily Dawn Publications', slug: 'dawn-media-group', country: 'Pakistan', website: 'https://dawn.com' },
  { id: 'pub-9', name: 'Jang Media Group', slug: 'jang-media', country: 'Pakistan', website: 'https://jang.com.pk' },
  { id: 'pub-10', name: 'Dollar Stationery Industries', slug: 'dollar-stationery', country: 'Pakistan', website: 'https://dollar-stationery.com' },
  { id: 'pub-11', name: 'Piano Writing Instruments', slug: 'piano-pens', country: 'Pakistan', website: 'https://pianopens.com' },
  { id: 'pub-12', name: 'Cambridge University Press', slug: 'cup-press', country: 'United Kingdom', website: 'https://cambridge.org' },
  
  // Turkish Premier Publishers
  { id: 'pub-tr-1', name: 'İletişim Yayınları Istanbul', slug: 'iletisim-yayinlari', country: 'Turkey', website: 'https://iletisim.com.tr' },
  { id: 'pub-tr-2', name: 'Yapı Kredi Yayınları (YKY)', slug: 'yky-istanbul', country: 'Turkey', website: 'https://ykykultur.com.tr' },
  { id: 'pub-tr-3', name: 'Can Yayınları', slug: 'can-yayinlari', country: 'Turkey', website: 'https://canyayinlari.com' },
  { id: 'pub-tr-4', name: 'Sang-e-Meel Turkish Classics Series (Pakistan)', slug: 'sang-e-meel-turkish', country: 'Pakistan', website: 'https://sangemeel.com' },
  { id: 'pub-tr-5', name: 'Penguin Modern Classics (Turkish Translations)', slug: 'penguin-turkish', country: 'United Kingdom', website: 'https://penguin.co.uk' },
];

export const PAPER_QUALITIES: PaperQuality[] = [
  'Standard Paper',
  'Premium Paper',
  'High-Quality White Paper',
  'Cream Paper',
  'Glossy Paper',
  'Matte Paper',
  'Recycled Paper',
  'Hardbound Edition',
  'Paperback Edition'
];

// Curated aesthetic covers by theme
const COVERS: Record<string, string[]> = {
  academic: [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
  ],
  exam: [
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
  ],
  literature: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
  ],
  knowledge: [
    'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507842229451-7f01be45c06b?auto=format&fit=crop&w=600&q=80',
  ],
  kids: [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  ],
  periodicals: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&w=600&q=80',
  ],
  stationery: [
    'https://images.unsplash.com/photo-1585336261026-62c76d29994c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1501618669935-18b6ecb13d6d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=600&q=80',
  ],
  turkish: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
  ]
};

// Seed Anchor title definitions for realistic titles per category domain
const THEME_ANCHORS: Record<string, { titles: string[]; authors: string[]; publishers: string[]; covers: string[]; lang?: string }> = {
  // CSS & PMS
  'css-prep': {
    titles: [
      'Caravan Comprehensive Manual for CSS Pakistan Affairs',
      'Dogar Brothers High-Scoring Solved CSS Essay Masterclass',
      'Current Affairs 2026 Monthly Dossier & Geopolitics Analysis',
      'International Relations Theories & Foreign Policy of Pakistan',
      'Criminology & Forensic Science Comprehensive Reference Guide',
      'Public Administration & Governance in Developing Nations',
      'Constitutional Law of Pakistan, USA, and UK Comparative Manual',
      'General Science & Ability Complete Guide with Solved Quantitative Math',
      'English Précis & Composition High-Scoring Compulsory Guide',
      'Islamic Studies Conceptual Review & Analytical Discourses',
      'Political Science Western & Muslim Thinkers Anthology',
      'European History (1789-1945) Solved Past Papers & Maps'
    ],
    authors: ['Dogar Brothers Editorial Board', 'Caravan Research Panel', 'Dr. Sultan Mahmood', 'Hamid Khan'],
    publishers: ['Caravan Book House Lahore', 'Dogar Brothers Publishers', 'Ilmi Kitab Khana Urdu Bazaar'],
    covers: COVERS.exam
  },
  'pms-prep': {
    titles: [
      'PMS Compulsory Urdu Adab, Grammar & Translation Manual',
      'Punjab Management Service General Knowledge Master Encyclopedia',
      'PMS Pakistan Studies & Constitutional Developments 2026',
      'PMS English Essay & Applied Grammar Writing Techniques',
      'Sociology for Provincial Civil Services Competitive Examinations',
      'Mass Communication & Media Ethics Guide for PMS Candidates'
    ],
    authors: ['Caravan Research Panel', 'Dogar Brothers Editorial Board', 'Prof. Tariq Aziz'],
    publishers: ['Caravan Book House Lahore', 'Ilmi Kitab Khana Urdu Bazaar'],
    covers: COVERS.exam
  },
  // Law
  'llb-books': {
    titles: [
      'The Constitution of the Islamic Republic of Pakistan (As Amended to 2026)',
      'Pakistan Penal Code (Act XLV of 1860) with Landmark Case Commentary',
      'Code of Criminal Procedure (CrPC 1898) Major Acts Manual',
      'Code of Civil Procedure (CPC 1908) with Punjab & Sindh Amendments',
      'Law of Torts and Consumer Protection Act Illustrated Manual',
      'Qanun-e-Shahadat Order 1984 (Law of Evidence) Analytical Treatise',
      'Specific Relief Act & Law of Contract Case Studies Reference',
      'Islamic Jurisprudence (Usul al-Fiqh) by Justice (R) Dr. Munir'
    ],
    authors: ['Hamid Khan', 'Justice (R) Fazal Karim', 'M. Mahmood Advocate', 'Mansoor Book House Panel'],
    publishers: ['Mansoor Book House Lahore', 'Oxford University Press Pakistan', 'Caravan Book House Lahore'],
    covers: COVERS.exam
  },
  'lat-prep': {
    titles: [
      'HEC Law Admission Test (LAT) Complete Guide with Solved Papers',
      'LAT Personal Statement & Urdu/English Essay Scoring Strategies',
      'LAT General Knowledge, Pakistan Studies & Islamic Studies 5000+ MCQs',
      'LAT Analytical Reasoning & English Verbal Ability Practice Tests',
      'LAT 10 Full-Length Mock Test Papers with Answer Keys'
    ],
    authors: ['Dogar Brothers Editorial Board', 'Advocate Bilal Hassan', 'Caravan Research Panel'],
    publishers: ['Dogar Brothers Publishers', 'Caravan Book House Lahore'],
    covers: COVERS.exam
  },
  // Medical & Engineering
  'mdcat-prep': {
    titles: [
      'KIPS MDCAT Biology Conceptual High-Yield Question Bank',
      'PMDC Core MDCAT Chemistry Organic & Physical Solved Manual',
      'MDCAT Physics Numerical Problems, Shortcuts & Formula Sheet',
      'MDCAT English Vocabulary, Grammar & Critical Logical Reasoning',
      'UHS & NUMS Past 10 Years Solved Model Papers & Diagnostic Tests',
      'Doctor Series: 7000+ Conceptual MCQs with Detailed Explanations'
    ],
    authors: ['KIPS Publications Panel', 'Dr. Farooq Medical Panel', 'Dogar Brothers Editorial Board'],
    publishers: ['KIPS Publications', 'Dogar Brothers Publishers', 'Caravan Book House Lahore'],
    covers: COVERS.academic
  },
  'ecat-prep': {
    titles: [
      'KIPS ECAT Engineering Mathematics Analytical Shortcuts Manual',
      'UET ECAT Physics Vectors, Electromagnetism & Modern Physics Solved',
      'ECAT Chemistry High-Yield Reactions & Numerical Problems Guide',
      'ECAT Computer Science Programming & Algorithms MCQs Bank',
      'Engineering Entry Tests 12 Full Model Papers with Step-by-Step Solutions'
    ],
    authors: ['KIPS Publications Panel', 'Prof. Engr. Salman Riaz', 'Dogar Brothers Editorial Board'],
    publishers: ['KIPS Publications', 'Dogar Brothers Publishers'],
    covers: COVERS.academic
  },
  // Literature - Urdu
  'urdu-novels': {
    titles: [
      'Peer-e-Kamil (S.A.W) – Special Deluxe Hardbound Edition',
      'Aab-e-Hayat – Complete Sequel & Journey of Spiritual Radiance',
      'Jannat Kay Pattay – Bestselling Gold Foil Collector Edition',
      'Namal – Epic Crime, Law, & Psychological Thriller (2 Volumes)',
      'Amar Bail – Classic Tale of Bureaucracy, Love, and Vulnerability',
      'Raja Gidh – Sociological & Psychological Masterpiece of Desires',
      'Mushaf – The Transformative Journey of Faith and Redemption',
      'Haalim – Time Travel, Espionage, and Political Treachery Chronicle',
      'Alif – A Soulful Awakening of Modern Art and Spiritual Roots',
      'Zavia – Wise Life Dialogues & Spiritual Reflections'
    ],
    authors: ['Umera Ahmed', 'Nimra Ahmed', 'Bano Qudsia', 'Ashfaq Ahmed', 'Mumtaz Mufti'],
    publishers: ['Sang-e-Meel Publications', 'Ferozsons Pakistan', 'Ilmi Kitab Khana Urdu Bazaar'],
    covers: COVERS.literature,
    lang: 'Urdu'
  },
  'poetry': {
    titles: [
      'Kulliyat-e-Faiz: Complete Poetic Works with Contextual Annotations',
      'Bang-e-Dra (The Call of the Marching Bell) – Philosophy of Khudi',
      'Bal-e-Jibril (Gabriel Wing) – Philosophical Urdu Verses',
      'Zarb-e-Kaleem (The Stroke of Moses) – Political & Cultural Poetry',
      'Deewan-e-Ghalib with Commentary & Explanation by Ghulam Rasool',
      'Khushboo – Fragrance of Emotions, Collected Works of Parveen Shakir',
      'Jana Jana – Immortal Love Ghazals and Nazms by Ahmad Faraz',
      'Shayad – Poetic Collection of Heartbreak and Intellect by Jaun Elia'
    ],
    authors: ['Faiz Ahmad Faiz', 'Allama Muhammad Iqbal', 'Mirza Asadullah Khan Ghalib', 'Parveen Shakir', 'Ahmad Faraz', 'Jaun Elia'],
    publishers: ['Sang-e-Meel Publications', 'Ferozsons Pakistan', 'Oxford University Press Pakistan'],
    covers: COVERS.literature,
    lang: 'Urdu'
  },
  // Newspapers
  'newspapers': {
    titles: [
      'Daily Dawn Morning National Edition (Physical Print Newspaper)',
      'The News International Daily Morning Edition (Print)',
      'Daily Jang Rawalpindi / Islamabad City Edition (Urdu Print)',
      'Daily Express Lahore Morning Print Edition',
      'Business Recorder Financial & Stock Exchange Daily (Print)',
      'Jahangir’s World Times Monthly Current Affairs & CSS Research Journal',
      'Herald Investigative Politics & Social Review Monthly Magazine',
      'Newsweek International Monthly Pakistan & South Asia Edition',
      'The Economist Global Issues Review Weekly Print Issue'
    ],
    authors: ['Dawn Media Editorial Board', 'Jang Group Editorial Team', 'Caravan Research Panel', 'Economist Group'],
    publishers: ['Daily Dawn Publications', 'Jang Media Group', 'Caravan Book House Lahore'],
    covers: COVERS.periodicals
  },
  // Stationery
  'stationery': {
    titles: [
      'Classmate Hardbound Academic Register 300 Pages (A4 Premium White)',
      'Spiral Bound College Lecture Notebook 200 Pages with Divider Tabs',
      'University Lecture Ledger 400 Pages Thick Thread-Bound Archival',
      'Deli Leather Executive Journal & Daily Academic Planner 2026',
      'Engineering Graph Pad A4 100 Sheets Grid (1mm / 1cm Precision)',
      'Piano Point 0.8mm Ballpoint Pens (Box of 10 Assorted Colors)',
      'Dollar SP-10 Fountain Pen with Iridium Point Nib & Ink Converter',
      'Pelikan 4001 Brilliant Black Fountain Pen Ink Bottle 62.5ml',
      'Stabilo Boss Original Pastel Highlighters (Wallet of 6 Colors)',
      'Deli Deluxe Mathematical Drawing Instruments & Geometry Box Set',
      'Heavy Duty 2-Ring Binder File with Label Spine (Pack of 2)'
    ],
    authors: ['PaperNest Academic Division', 'Dollar Industries Design Panel', 'Deli Stationery Team'],
    publishers: ['Dollar Stationery Industries', 'Piano Writing Instruments', 'Oxford University Press Pakistan'],
    covers: COVERS.stationery
  },
  // Turkish Books & Literature Collection (50+ Verified Masterpieces)
  'turkish-books': {
    titles: [
      'Kürk Mantolu Madonna (Madonna in a Fur Coat)',
      'Masumiyet Müzesi (The Museum of Innocence)',
      'Aşk (The Forty Rules of Love / چالیس قواعد عشق)',
      'Benim Adım Kırmızı (My Name Is Red)',
      'İnce Memed (Memed, My Hawk)',
      'Saatleri Ayarlama Enstitüsü (The Time Regulation Institute)',
      'Çalıkuşu (The Wren / The Autobiography of a Turkish Girl)',
      'Kuyucaklı Yusuf (Yusuf of Kuyucak)',
      'Kar (Snow)',
      'İçimizdeki Şeytan (The Devil Within)',
      'Huzur (A Mind at Peace)',
      '10 Dakika 38 Saniye (10 Minutes 38 Seconds in This Strange World)',
      'Memleketimden İnsan Manzaraları (Human Landscapes from My Country)',
      'Kara Kitap (The Black Book)',
      'Ateşten Gömlek (The Shirt of Flame / Fire Shirt)',
      'Kayıp Ağaçlar Adası (The Island of Missing Trees)',
      'Yaşamak Güzel Şey Be Kardeşim (Life\'s Good, Brother)',
      'Sinekli Bakkal (The Clown and His Daughter)',
      'Damga (The Stigma)',
      'Beyaz Kale (The White Castle)',
      'Kafamda Bir Tuhaflık (A Strangeness in My Mind)',
      'Baba ve Piç (The Bastard of Istanbul)',
      'Açlık Çoğunluktadır (Humorous Stories of Istanbul)',
      'Yaşar Ne Yaşar Ne Yaşamaz (Yashar Neither Lives Nor Doesn\'t Live)',
      'Tutunamayanlar (The Disconnected / The Losers)',
      'Tehlikeli Oyunlar (Dangerous Games)',
      'Aşk-ı Memnu (Forbidden Love)',
      'Semaver (The Samovar & Other Stories)',
      'Lüzumsuz Adam (The Useless Man)',
      'Dokuzuncu Hariciye Koğuşu (The Ninth External Ward)',
      'Fatih-Harbiye (East and West in Istanbul)',
      'Bütün Şiirleri (Collected Poems of Nazım Hikmet)',
      'Veba Geceleri (Nights of Plague)',
      'Toros Canavarı (The Taurus Monster - Satirical Comedy)',
      'Osmanlı Tarihi ve Kültürü (Ottoman History & Civilisation)',
      'İstanbul: Hatıralar ve Şehir (Istanbul: Memories and the City)',
      'Yaban (The Wild One / The Stranger in Anatolia)',
      'Kiralık Konak (The Mansion for Rent)',
      'Havada Bulut (Clouds in the Sky)',
      'İpekli Mendil (The Silk Handkerchief)',
      'Kırmızı Saçlı Kadın (The Red-Haired Woman)',
      'İskender (Honour)',
      'Şemsettin Sami: Kamus-ı Türki & Classical Turkish Prose',
      'Akşam Güneşi (The Setting Sun)',
      'Acımak (Pity & Compassion)',
      'Demirciler Çarşısı Cinayeti (Murder in the Ironsmiths Market)',
      'Yılanı Öldürseler (To Crush the Serpent)',
      'Bir Düğün Gecesi (A Wedding Night)',
      'Ölmeye Yatmak (Lying Down to Die)',
      'Bize Göre ve Gurabahane-i Laklakan (Essays on Modernity)',
      'Cevdet Bey ve Oğulları (Cevdet Bey and His Sons)',
      'Dede Korkut Kitabı (The Book of Dede Korkut - Epic Stories)',
      'Yunus Emre Divanı (Divan of Yunus Emre - Mystic Sufi Poetry)',
      'Mesnevi-i Manevi (Turkish Poetic Translation of Rumi)'
    ],
    authors: [
      'Orhan Pamuk',
      'Elif Shafak',
      'Sabahattin Ali',
      'Yaşar Kemal',
      'Nazım Hikmet',
      'Ahmet Hamdi Tanpınar',
      'Reşat Nuri Güntekin',
      'Aziz Nesin',
      'Halide Edip Adıvar',
      'Oğuz Atay',
      'Sait Faik Abasıyanık',
      'Peyami Safa'
    ],
    publishers: [
      'İletişim Yayınları Istanbul',
      'Yapı Kredi Yayınları (YKY)',
      'Can Yayınları',
      'Sang-e-Meel Turkish Classics Series (Pakistan)',
      'Penguin Modern Classics (Turkish Translations)'
    ],
    covers: COVERS.turkish
  }
};

export function generateCatalog(): { products: Product[]; inventory: InventoryItem[] } {
  const products: Product[] = [];
  const inventory: InventoryItem[] = [];
  let globalCounter = 1;

  function addProduct(
    p: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'slug'>,
    stockConfig: { opening: number; received: number; sold: number; reorder: number }
  ) {
    const id = `pn-prod-${String(globalCounter).padStart(5, '0')}`;
    const slug = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${globalCounter}`;
    const now = new Date(Date.now() - (globalCounter * 86400000) / 30).toISOString();

    const product: Product = {
      ...p,
      id,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    const remainingStock = stockConfig.opening + stockConfig.received - stockConfig.sold;
    let stockStatus: InventoryItem['stockStatus'] = 'In Stock';
    if (remainingStock <= 0) {
      stockStatus = 'Out of Stock';
    } else if (remainingStock <= stockConfig.reorder) {
      stockStatus = 'Low Stock';
    }

    const inv: InventoryItem = {
      id: `inv-${id}`,
      productId: id,
      productName: product.name,
      productCover: product.coverImage,
      categoryName: product.categoryName,
      openingStock: stockConfig.opening,
      stockReceived: stockConfig.received,
      unitsSold: stockConfig.sold,
      remainingStock,
      reservedStock: Math.floor(stockConfig.sold * 0.05),
      availableStock: Math.max(0, remainingStock - Math.floor(stockConfig.sold * 0.05)),
      reorderLevel: stockConfig.reorder,
      stockStatus,
      lastUpdated: now,
    };

    products.push(product);
    inventory.push(inv);
    globalCounter++;
  }

  // Iterate over every category in CATEGORIES and ensure at least 52 unique products!
  CATEGORIES.forEach((cat) => {
    const anchor = THEME_ANCHORS[cat.id] || {
      titles: [
        `${cat.name} – Comprehensive Guide & Foundations`,
        `Advanced Concepts & Principles in ${cat.name}`,
        `${cat.name} Case Studies and Analytical Workbook`,
        `The Essential Handbook of ${cat.name}`,
        `Modern Perspectives and Solved Exercises in ${cat.name}`,
        `${cat.name} Masterclass & Theory Vol. 1`,
        `${cat.name} Classical Treatises & Contemporary Issues`
      ],
      authors: [AUTHORS[globalCounter % AUTHORS.length].name, 'Academic Research Editorial Board'],
      publishers: [PUBLISHERS[globalCounter % PUBLISHERS.length].name],
      covers: COVERS.academic
    };

    const targetCount = 52; // Exceeds target of 50+ books per category

    for (let i = 1; i <= targetCount; i++) {
      const baseTitle = anchor.titles[(i - 1) % anchor.titles.length];
      const title = i <= anchor.titles.length
        ? baseTitle
        : `${baseTitle} (Edition ${Math.floor(i / anchor.titles.length) + 1}, Volume ${i})`;

      const authorName = anchor.authors[i % anchor.authors.length] || AUTHORS[i % AUTHORS.length].name;
      const publisherName = anchor.publishers[i % anchor.publishers.length] || PUBLISHERS[i % PUBLISHERS.length].name;
      const coversList = anchor.covers || COVERS.academic;
      const coverImage = coversList[(i + globalCounter) % coversList.length];

      const price = 450 + ((i * 67 + globalCounter * 31) % 2900);
      const discount = (i % 3 === 0) ? Math.round(price * 0.85) : undefined;
      const sold = 12 + ((i * 7 + globalCounter * 3) % 95);
      const opening = 40 + ((i * 5 + globalCounter) % 70);
      const received = 30 + (i % 40);
      const reorder = 12;

      const isStationeryOrNews = cat.id === 'newspapers' || cat.id === 'stationery';
      const productType: Product['productType'] = cat.id === 'newspapers'
        ? (title.includes('Magazine') || title.includes('Journal') ? 'Magazine' : 'Newspaper')
        : cat.id === 'stationery'
        ? 'Stationery'
        : 'Book';

      const paperQuality = isStationeryOrNews
        ? (cat.id === 'newspapers' ? 'Recycled Paper' : 'High-Quality White Paper')
        : PAPER_QUALITIES[(i + globalCounter) % PAPER_QUALITIES.length];

      let language = anchor.lang || (cat.id.includes('urdu') ? 'Urdu' : (i % 4 === 0 ? 'Urdu' : 'English'));
      let originalTitle: string | undefined = undefined;
      let englishTitle: string | undefined = undefined;
      let subcategoryId: string | undefined = undefined;
      let subcategoryName: string | undefined = undefined;

      if (cat.id === 'turkish-books') {
        const match = title.match(/^([^(]+)(?:\(([^)]+)\))?/);
        if (match) {
          originalTitle = match[1].trim();
          englishTitle = match[2] ? match[2].trim() : originalTitle;
        }
        const langIndex = i % 3;
        if (langIndex === 1) {
          language = 'Turkish';
        } else if (langIndex === 2) {
          language = 'English Translation';
        } else {
          language = 'Urdu Translation';
        }

        if (title.includes('Madonna') || title.includes('Aşk') || title.includes('Çalıkuşu') || title.includes('Damga') || title.includes('Memnu')) {
          subcategoryId = 'sub-turkish-romance';
          subcategoryName = 'Turkish Romance & Emotional Classics';
        } else if (title.includes('Şiir') || title.includes('Divan') || title.includes('Nazım') || title.includes('Mesnevi')) {
          subcategoryId = 'sub-turkish-poetry';
          subcategoryName = 'Turkish Poetry & Sufi Verse';
        } else if (title.includes('Osmanlı') || title.includes('Tarihi') || title.includes('Essays') || title.includes('Şehir')) {
          subcategoryId = 'sub-turkish-history';
          subcategoryName = 'Ottoman & Republican Classics';
        } else if (title.includes('Aziz Nesin') || title.includes('Canavarı') || title.includes('Yaşar Ne') || title.includes('Saatleri')) {
          subcategoryId = 'sub-turkish-satire';
          subcategoryName = 'Turkish Satire & Philosophy';
        } else {
          subcategoryId = 'sub-turkish-novels';
          subcategoryName = 'Turkish Novels & Contemporary Fiction';
        }
      }

      const description = cat.id === 'turkish-books'
        ? `Masterpiece Turkish literature: "${title}" by renowned author ${authorName}. Available in ${language} with faithful literary translation, rich cultural annotations, and authentic publishing standards.`
        : `Authoritative, high-quality edition of "${title}" curated by ${authorName}. Features authentic academic text, crisp printing, durable binding, and thorough indexing.`;

      addProduct(
        {
          name: title,
          originalTitle,
          englishTitle,
          coverImage,
          authorName,
          publisherName,
          categoryId: cat.id,
          categoryName: cat.name,
          subcategoryId,
          subcategoryName,
          subject: cat.name,
          ageGroup: cat.groupType === 'age_group' ? cat.name : 'General Readers',
          educationLevel: cat.groupType === 'education_level' ? cat.name : 'All Levels',
          description,
          price,
          discountedPrice: discount,
          paperQuality,
          pageCount: isStationeryOrNews ? (cat.id === 'newspapers' ? 24 : 1) : 180 + ((i * 24) % 650),
          language,
          edition: `${(i % 5) + 1}th Revised Edition`,
          publicationYear: 2026 - (i % 5),
          isbn: `978-969-${String(1000 + (globalCounter % 8999))}-${i % 9}`,
          condition: 'New',
          productType,
          rating: Number((4.3 + (i % 7) * 0.1).toFixed(1)),
          reviewsCount: 15 + ((i * 5) % 85),
          isFeatured: (i % 7 === 0),
          isBestseller: (i % 5 === 0),
          tags: [cat.name, authorName, language, ...(originalTitle ? [originalTitle] : [])],
        },
        { opening, received, sold, reorder }
      );
    }
  });

  return { products, inventory };
}

// ---------------------------------------------------------------------------
// 55+ DEMO HISTORICAL ORDERS (CLEARLY IDENTIFIED SAMPLE RECORDS)
// ---------------------------------------------------------------------------
export function generateDemoOrders(): Order[] {
  const sampleCustomers = [
    { name: 'Ahmed Raza', city: 'Islamabad', address: 'House 42, Sector F-8/2, Margalla Road', phone: '+92 321 9876543' },
    { name: 'Fatima Tariq', city: 'Lahore', address: 'Plot 18, Block G, Model Town', phone: '+92 300 1234567' },
    { name: 'Zohaib Hassan', city: 'Karachi', address: 'Flat 4B, Gulshan-e-Iqbal Block 13-D', phone: '+92 333 4567890' },
    { name: 'Khadija Rehman', city: 'Rawalpindi', address: 'Street 9, Chaklala Scheme III', phone: '+92 312 9012345' },
    { name: 'Bilal Farooq', city: 'Peshawar', address: 'House 112, Hayatabad Phase 4', phone: '+92 345 6789012' },
    { name: 'Sanaullah Mengal', city: 'Quetta', address: 'Jinnah Town, Samungli Road', phone: '+92 331 2345678' },
    { name: 'Ayesha Kamran', city: 'Multan', address: 'Bosan Road, Near BZU Campus', phone: '+92 302 3456789' },
    { name: 'Hamza Abbasi', city: 'Faisalabad', address: 'D-Ground, Peoples Colony 1', phone: '+92 308 4567890' },
    { name: 'Zainab Bibi', city: 'Sialkot', address: 'Kashmir Road, Model Town', phone: '+92 314 5678901' },
    { name: 'Muhammad Arham', city: 'Hyderabad', address: 'Auto Bhan Road, Latifabad Unit 6', phone: '+92 322 6789012' },
    { name: 'Maryam Nawazish', city: 'Abbottabad', address: 'Supply Area, Mansehra Road', phone: '+92 306 7890123' },
    { name: 'Usman Ali', city: 'Gujranwala', address: 'DC Colony, Main Boulevard', phone: '+92 315 8901234' }
  ];

  const statuses: Order['orderStatus'][] = [
    'Delivered', 'Delivered', 'Delivered', 'Delivered',
    'Shipped', 'Shipped', 'Shipped',
    'Out for Delivery', 'Out for Delivery',
    'Processing', 'Processing',
    'Packed', 'Packed',
    'Confirmed', 'Confirmed',
    'Pending', 'Pending',
    'Cancelled', 'Returned'
  ];

  const couriers = [
    { name: 'TCS Express Pakistan', prefix: 'TCS-PK-' },
    { name: 'Leopards Courier Service', prefix: 'LEO-PK-' },
    { name: 'M&P Express Logistics', prefix: 'MP-PK-' },
    { name: 'Trax Logistics Pakistan', prefix: 'TRX-PK-' }
  ];

  const demoOrders: Order[] = [];

  for (let i = 1; i <= 55; i++) {
    const cust = sampleCustomers[(i - 1) % sampleCustomers.length];
    const status = statuses[(i - 1) % statuses.length];
    const courier = couriers[(i - 1) % couriers.length];
    const orderId = `PN-2026-DEMO-${String(i).padStart(2, '0')}`;
    const trackingNumber = `${courier.prefix}${1000000 + i * 3721}`;
    const daysAgo = 55 - i;
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
    const estDelivery = new Date(Date.now() - (daysAgo - 3) * 86400000).toISOString().split('T')[0];

    const itemPrice1 = 650 + (i * 95) % 1800;
    const itemPrice2 = 380 + (i * 45) % 750;
    const subtotal = itemPrice1 + itemPrice2;
    const discount = (i % 3 === 0) ? 250 : 0;
    const deliveryFee = subtotal >= 2500 ? 0 : 150;
    const finalTotal = subtotal - discount + deliveryFee;

    const items: OrderItem[] = [
      {
        id: `oi-demo-${i}-1`,
        orderId,
        productId: `pn-prod-${String((i * 7) % 500 + 1).padStart(5, '0')}`,
        productName: `Academic Study Resource Book #${i}`,
        coverImage: COVERS.academic[i % COVERS.academic.length],
        unitPrice: itemPrice1,
        quantity: 1,
        subtotal: itemPrice1,
        paperQuality: 'High-Quality White Paper'
      },
      {
        id: `oi-demo-${i}-2`,
        orderId,
        productId: `pn-prod-${String((i * 11) % 500 + 1).padStart(5, '0')}`,
        productName: `Essential Stationery / Study Guide #${i}`,
        coverImage: COVERS.stationery[i % COVERS.stationery.length],
        unitPrice: itemPrice2,
        quantity: 1,
        subtotal: itemPrice2,
        paperQuality: 'Standard Paper'
      }
    ];

    demoOrders.push({
      id: orderId,
      userId: cust.phone,
      customerName: cust.name,
      customerEmail: `${cust.name.toLowerCase().replace(/[^a-z]/g, '')}@example.pk`,
      customerPhone: cust.phone,
      deliveryAddress: cust.address,
      city: cust.city,
      postalCode: '54000',
      deliveryInstructions: 'Call before delivery. Sample historical demo order.',
      subtotal,
      discount,
      deliveryFee,
      finalTotal,
      paymentMethod: i % 4 === 0 ? 'Bank Transfer' : 'Cash on Delivery',
      paymentStatus: (status === 'Delivered' || status === 'Shipped') ? 'Paid' : 'Pending',
      orderStatus: status,
      trackingNumber,
      courierName: courier.name,
      estimatedDelivery: estDelivery,
      createdAt,
      updatedAt: createdAt,
      items,
      isDemo: true, // Transparent demo indicator
      shippingLabelPrinted: status !== 'Pending' && status !== 'Cancelled'
    });
  }

  return demoOrders;
}

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'pn-prod-00001',
    userName: 'Khadija Rehman (Lahore)',
    rating: 5,
    comment: 'Exceptional paper quality and vivid illustrations! Fast delivery to Gulberg.',
    verifiedPurchase: true,
    createdAt: '2026-02-10T10:15:00Z',
  },
  {
    id: 'rev-2',
    productId: 'pn-prod-00350',
    userName: 'Usman Ali (CSS Aspirant, Islamabad)',
    rating: 5,
    comment: 'The Caravan CSS Compulsory manual has everything organized systematically. Past papers are top-tier.',
    verifiedPurchase: true,
    createdAt: '2026-02-14T16:30:00Z',
  },
  {
    id: 'rev-3',
    productId: 'pn-prod-00500',
    userName: 'Ayesha Tariq (Karachi)',
    rating: 5,
    comment: 'Peer-e-Kamil in hardbound cream paper edition is an absolute treasure! Pristine condition.',
    verifiedPurchase: true,
    createdAt: '2026-02-18T09:20:00Z',
  },
  {
    id: 'rev-4',
    productId: 'pn-prod-00800',
    userName: 'Bilal Farooq (UET Lahore)',
    rating: 5,
    comment: 'Classmate registers are super sturdy. Zero ink bleed with my fountain pen.',
    verifiedPurchase: true,
    createdAt: '2026-02-22T14:45:00Z',
  }
];
