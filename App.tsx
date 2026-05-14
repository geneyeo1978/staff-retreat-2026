/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Settings, 
  Wifi, 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  ChevronRight,
  Clock,
  LayoutGrid
} from 'lucide-react';
import Papa from 'papaparse';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for Tailwind class merging
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==========================================
// CONFIG SECTION - EDITABLE BY NON-TECH USERS
// ==========================================
const CONFIG = {
  title: "STAFF RETREAT 2026, 17-18 November",
  theme: "THRIVING STAFF",
  csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfYevkCxQ5kIULNsUPTD_qLoUSAds0Pum_vtMfxNMk4DC5z86YDR40iuNCjiJ7w_ijZ7ZVU47IyMMN/pub?gid=841896005&single=true&output=csv", // Replace with your actual Google Sheet CSV URL
  day1: {
    title: "Day 1",
    date: "November 17, 2026",
    time: "08:30 AM - 05:00 PM",
    location: "HomeTeamNS Khatib, 2 Yishun Walk, S(767944)",
    schedule: [
      { time: "08:30 AM", activity: "Arrival, Registration & Breakfast!" },
      { time: "09:00 AM", activity: "Opening Keynote by Principal" },
      { time: "09:30 AM", activity: "Check In" },
      { time: "10:00 AM", activity: "Segment 1: Cultures of Thinking" },
      { time: "12:00 PM", activity: "Lunch Break" },
      { time: "1:00 PM", activity: "Staff Professional Adventure (SPA)!" },
    ]
  },
  day2: {
    title: "Day 2",
    date: "November 18, 2026",
    time: "09:00 AM - 04:00 PM",
    schedule: [
      { time: "08:30 AM", activity: "Morning Wellness: Breakfast!" },
      { time: "09:00 AM", activity: "Work Plan Seminar 2026" },
      { time: "12:00 PM", activity: "Lunch Break" },
      { time: "01:00 PM", activity: "Staff Bonding: Colour Hunt!" },
      { time: "03:00 PM", activity: "Staff reflections" },
      { time: "04:00 PM", activity: "Thanksgiving & Appreciation" },
      { time: "05:00 PM", activity: "Home Sweet Home" }
    ]
  },
  adminInfo: {
    wifiPassword: "THRIVE_TOGETHER_2026",
    mapImageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2626&auto=format&fit=crop", // Placeholder image
    emergencyInstructions: [
      "Event ICs: Melissa, Caleb, Priscilla, Gene",
      "Contact Event Coordinator: +65 1234 5678",
      "First Aid Station: Located at the Main Lobby",
      "Emergency Assembly Point: West Lawn",
      "Fire Exit: Follow green signage at all exits"
    ]
  },
  faq: [
    { question: "What to bring?", answer: "Please bring your laptop, laptop charger, and a jacket if needed." },
    { question: "Is lunch provided?", answer: "Lunch is provided on the second day only." },
    { question: "What about breakfast?", answer: "Breakfast will be provided on both days." },
    { question: "Is water available?", answer: "Water dispenser will be available. Please bring your own reusable bottle." },
    { question: "Is there parking onsite?", answer: "Parking is not available onsite. We encourage carpooling or using public transport." }
  ]
};

// ==========================================
// TYPES
// ==========================================
interface Participant {
  name: string;
  table: string | number;
}

interface ScheduleItem {
  time: string;
  activity: string;
}

// ==========================================
// COMPONENTS
// ==========================================

const Header = () => (
  <header className="md:hidden bg-white/50 backdrop-blur-sm border-b border-ink/10 py-6 px-6 text-center">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-accent mb-4">
        St Andrew's School (Secondary)
      </p>
      <h1 className="font-serif text-4xl font-black leading-none mb-1">
        2026
      </h1>
      <p className="uppercase tracking-[0.2em] text-[10px] font-bold opacity-60">
        Staff Retreat
      </p>
      <h2 className="font-serif italic text-xl text-accent mt-2">
        {CONFIG.theme}
      </h2>
    </motion.div>
  </header>
);

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => (
  <aside className="hidden md:flex w-1/4 min-w-[280px] border-r border-ink/10 p-10 flex-col justify-between fixed h-screen bg-ink z-50">
    <div className="space-y-8">
      <div className="flex flex-col items-start gap-2">
        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-accent mb-4">
          St Andrew's School (Secondary)
        </p>
        <div>
          <h1 className="font-serif text-7xl font-black leading-none mb-1 text-white">2026</h1>
          <p className="uppercase tracking-[0.3em] text-xs font-bold text-white/40">Staff Retreat</p>
        </div>
      </div>

      <div className="py-2">
        <h2 className="font-serif italic text-3xl text-accent leading-tight">{CONFIG.theme}</h2>
        <div className="h-px w-12 bg-accent mt-6 opacity-40"></div>
      </div>

      <nav className="flex flex-col items-start gap-5 pt-2">
        {[
          { id: 'day1', label: 'Day 01', icon: Calendar },
          { id: 'day2', label: 'Day 02', icon: Calendar },
          { id: 'seating', label: 'Seating Plan', icon: Users },
          { id: 'faq', label: 'FAQ', icon: AlertTriangle },
          { id: 'admin', label: 'Admin Info', icon: Settings }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "group flex items-center gap-3 text-sm uppercase tracking-widest transition-all duration-300",
              activeTab === item.id 
                ? "text-white font-bold" 
                : "text-white/40 hover:text-accent"
            )}
          >
            <span className={cn(
                  "w-1 h-3 transition-all duration-300",
                  activeTab === item.id ? "bg-accent" : "bg-transparent group-hover:bg-accent/30"
            )} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
    <div className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">
      &copy; Org Dev 2026
    </div>
  </aside>
);

const ScheduleView = ({ day }: { day: typeof CONFIG.day1, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="h-full"
  >
    <div className="flex flex-col sm:flex-row justify-between items-baseline mb-12 border-b border-ink/10 pb-6">
      <h3 className="font-serif text-4xl sm:text-5xl text-ink">Schedule <span className="italic opacity-30">/</span> {day.title === "Day 1" ? "01" : "02"}</h3>
      <span className="text-[10px] sm:text-xs tracking-[0.2em] opacity-40 uppercase font-bold mt-2 sm:mt-0">{day.date}</span>
    </div>

    <div className="max-w-2xl space-y-px">
      <div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] gap-4 py-3 opacity-30 text-[10px] uppercase tracking-widest font-bold border-b border-ink/5">
        <div>Time</div>
        <div>Activity</div>
      </div>
      
      {day.schedule.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] gap-4 py-6 border-b border-ink/5 group"
        >
          <div className="font-serif text-sm md:text-base text-ink opacity-60 tabular-nums">
            {item.time.replace(/ (AM|PM)/, '')}
          </div>
          <div className={cn(
            "text-base md:text-lg transition-colors group-hover:text-accent",
            item.activity.toLowerCase().includes('break') || item.activity.toLowerCase().includes('tea') || item.activity.toLowerCase().includes('lunch')
              ? "font-serif italic text-accent/80"
              : "font-medium"
          )}>
            {item.activity}
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const SeatingPlanView = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const isPlaceholder = CONFIG.csvUrl.includes("S_O_L_U_T_I_O_N");
      
      if (isPlaceholder) {
        const mockData: Participant[] = [];
        const names = ["Alice Smith", "Bob Jones", "Charlie Brown", "David Wilson", "Eva Green", "Frank Miller", "Grace Ho", "Henry Ford", "Ivy League", "Jack Black", "Kara Danvers", "Leo Messi", "Mia Wong", "Noah Centineo"];
        for (let t = 1; t <= 14; t++) {
          for (let s = 1; s <= 10; s++) {
            mockData.push({ 
              name: `${names[Math.floor(Math.random() * names.length)]} ${t}-${s}`, 
              table: t 
            });
          }
        }
        setParticipants(mockData);
      } else {
        const response = await fetch(CONFIG.csvUrl);
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: false,
          complete: (results) => {
            const data = results.data as string[][];
            const parsed = data
              .filter(row => row[0] && row[1])
              .map(row => ({
                name: row[0].trim(),
                table: row[1].trim()
              }));
            setParticipants(parsed);
          }
        });
      }
      setLastRefreshed(new Date());
    } catch (error) {
      console.error("Error fetching seating plan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  const filteredParticipants = useMemo(() => {
    if (!search) return [];
    return participants.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, participants]);

  const tables = useMemo(() => {
    const tMap: Record<string | number, Participant[]> = {};
    participants.forEach(p => {
      if (!tMap[p.table]) tMap[p.table] = [];
      tMap[p.table].push(p);
    });
    return tMap;
  }, [participants]);

  const selectedParticipant = useMemo(() => {
    if (!search) return null;
    return participants.find(p => p.name.toLowerCase() === search.toLowerCase()) || filteredParticipants[0];
  }, [search, participants, filteredParticipants]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
        <div className="max-w-md">
          <h3 className="font-serif text-4xl sm:text-5xl text-ink mb-3">Seating</h3>
          <p className="text-xs opacity-50 leading-relaxed uppercase tracking-wider font-medium">
            Search for your name to locate your assigned table for the evening gala.
          </p>
        </div>
        
        <div className="w-full lg:w-72 relative">
          <div className="flex items-center gap-3 bg-white px-4 py-3 border border-ink/10 shadow-sm focus-within:border-accent/40 transition-colors">
            <Search className="w-4 h-4 text-ink/30" />
            <input
              type="text"
              placeholder="Search Participant..."
              className="text-sm bg-transparent outline-none w-full font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <AnimatePresence>
            {search && filteredParticipants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute z-50 w-full mt-1 bg-white border border-ink/10 shadow-2xl max-h-64 overflow-y-auto"
              >
                {filteredParticipants.map((p, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-4 py-3 hover:bg-paper transition-colors flex justify-between items-center group"
                    onClick={() => setSearch(p.name)}
                  >
                    <span className="text-sm font-medium text-ink/80 group-hover:text-ink">{p.name}</span>
                    <span className="text-[10px] font-bold text-accent opacity-60">TABLE {p.table}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-8 xl:gap-12 pb-12">
        {Array.from({ length: 14 }).map((_, i) => {
          const tableNum = i + 1;
          const isHighlighted = selectedParticipant?.table.toString() === tableNum.toString();

          return (
            <div 
              key={tableNum}
              className="flex flex-col items-center gap-3"
            >
              <div 
                className={cn(
                  "w-14 h-14 rounded-full border flex items-center justify-center font-serif text-sm transition-all duration-500",
                  isHighlighted 
                    ? "bg-accent text-ink border-accent scale-125 shadow-xl shadow-accent/20 font-bold" 
                    : "bg-white border-ink/10 text-ink/40"
                )}
              >
                {tableNum < 10 ? `0${tableNum}` : tableNum}
              </div>
              <span className={cn(
                "text-[9px] uppercase tracking-widest font-bold",
                isHighlighted ? "text-accent" : "opacity-30"
              )}>
                {isHighlighted ? "Search Result" : `Table ${tableNum}`}
              </span>
            </div>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center gap-2 text-[10px] text-ink/20 font-bold uppercase tracking-[0.2em] mt-auto">
        <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
        Last Updated: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </motion.div>
  );
};

const AdminInfoView = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="h-full"
  >
    <h3 className="font-serif text-4xl sm:text-5xl text-ink mb-12">Information</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
      <div className="space-y-12">
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 mb-4">Connectivity</h4>
          <div className="bg-white p-8 border border-ink/5 shadow-sm space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Network</span>
              <span className="text-sm font-medium">STAFF_RETREAT_2026</span>
            </div>
            <div className="flex flex-col gap-1 pt-4 border-t border-ink/5">
              <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Password</span>
              <span className="text-sm font-bold font-mono tracking-tighter select-all">{CONFIG.adminInfo.wifiPassword}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 mb-4">Emergencies</h4>
          <div className="space-y-6">
            {CONFIG.adminInfo.emergencyInstructions.map((instruction, idx) => (
              <p key={idx} className="text-sm leading-relaxed text-ink/70">
                <span className="font-serif italic text-accent mr-3 font-bold select-none">{idx + 1}.</span>
                {instruction}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 mb-4">Site Map</h4>
        <div className="aspect-square sm:aspect-video md:aspect-square bg-ink/5 border border-ink/10 relative group overflow-hidden">
          <img 
            src={CONFIG.adminInfo.mapImageUrl} 
            alt="Site Map" 
            className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <span className="font-serif italic text-xs uppercase tracking-widest text-ink">Interactive View</span>
          </div>
        </div>
        <p className="text-[10px] text-ink/40 font-medium italic tracking-widest uppercase text-right">Main Ballroom & East Pavilion</p>
      </div>
    </div>
  </motion.div>
);

const FAQView = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="h-full"
  >
    <h3 className="font-serif text-4xl sm:text-5xl text-ink mb-12">Frequently Asked Questions</h3>
    
    <div className="max-w-3xl space-y-8">
      {CONFIG.faq.map((item, idx) => (
        <div key={idx} className="group">
          <div className="flex items-start gap-4 mb-2">
            <span className="font-serif text-2xl text-accent/40 group-hover:text-accent transition-colors font-bold select-none">Q.</span>
            <h4 className="text-lg md:text-xl font-bold text-ink leading-tight pt-1">
              {item.question}
            </h4>
          </div>
          <div className="flex items-start gap-4 ml-0 sm:ml-8">
            <p className="text-base text-ink/60 leading-relaxed pl-[2px] border-l-2 border-accent/20 group-hover:border-accent/40 transition-colors py-1">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState('day1');

  return (
    <div className="min-h-screen bg-paper flex flex-col md:flex-row">
      <Header />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 md:ml-[25%] p-6 sm:p-10 lg:p-20 overflow-hidden relative min-h-screen">
        <div className="max-w-5xl mx-auto h-full">
          <AnimatePresence mode="wait">
            {activeTab === 'day1' && <ScheduleView key="day1" day={CONFIG.day1} />}
            {activeTab === 'day2' && <ScheduleView key="day2" day={CONFIG.day2} />}
            {activeTab === 'seating' && <SeatingPlanView key="seating" />}
            {activeTab === 'faq' && <FAQView key="faq" />}
            {activeTab === 'admin' && <AdminInfoView key="admin" />}
          </AnimatePresence>
        </div>

        {/* Mobile Nav - only visible on small screens */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-ink/90 backdrop-blur-md border border-white/10 h-16 flex items-center justify-around z-50 shadow-2xl rounded-2xl">
          {[
            { id: 'day1', icon: Calendar },
            { id: 'day2', icon: Clock },
            { id: 'seating', icon: Users },
            { id: 'faq', icon: AlertTriangle },
            { id: 'admin', icon: Settings }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "p-3 rounded-xl transition-all duration-300",
                activeTab === item.id 
                  ? "bg-accent text-ink" 
                  : "text-white/40"
              )}
            >
              <item.icon size={20} />
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
