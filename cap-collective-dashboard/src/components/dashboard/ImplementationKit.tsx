"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  Circle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
  Trash2,
  ArrowRight,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Award,
  Target,
  BookOpen,
  Wrench,
  Users,
  BarChart2,
  Shield,
  Box,
  Palette,
  Globe,
  Heart,
  Star,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

const STORAGE_KEY = "cap-collective-implementation-progress";
const EXPORT_KEY = "cap-collective-export-data";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: "admin" | "teacher" | "student" | "operations" | "scaling";
  phase: "launch" | "build" | "process" | "product" | "market" | "scale";
  difficulty: "easy" | "medium" | "hard";
  timeEstimate: string;
  resources: string[];
  completed: boolean;
  required: boolean;
}

interface PhaseProgress {
  phase: string;
  total: number;
  completed: number;
}

const PHASES = [
  { key: "launch", label: "Launch", icon: Zap, color: "bg-orange-500", desc: "Admin approval, space prep, equipment order, team formation" },
  { key: "build", label: "Build", icon: Wrench, color: "bg-blue-500", desc: "Build boxes, install sensors, safety training, first collection" },
  { key: "process", label: "Process", icon: Box, color: "bg-green-500", desc: "Weekly cycles: collect→wash→shred→press→finish" },
  { key: "product", label: "Product", icon: Palette, color: "bg-purple-500", desc: "Design sprint, mold making, QC, branding, packaging" },
  { key: "market", label: "Market", icon: Globe, color: "bg-pink-500", desc: "Eco-store launch, sales, community events, impact report" },
  { key: "scale", label: "Scale", icon: Users, color: "bg-indigo-500", desc: "Reflect, document, train next cohort, grant writing" },
];

const CHECKLIST: ChecklistItem[] = [
  // LAUNCH PHASE
  {
    id: "admin-buyin",
    title: "Secure Admin Buy-In",
    description: "Present Launch Deck to principal, get signed MOU, designate Program Lead",
    category: "admin",
    phase: "launch",
    difficulty: "medium",
    timeEstimate: "1-2 weeks",
    resources: ["01_LAUNCH_DECK_PRESENTATION.md", "07_ADMIN_QUICKSTART_CHECKLIST.md", "12_SCHOOL_BUYIN_AND_APPROVAL_PLAYBOOK.md"],
    completed: false,
    required: true,
  },
  {
    id: "space-assessment",
    title: "Complete Space Assessment",
    description: "Verify ventilation (100+ CFM), 16A/20A power, sink access, storage, fire safety",
    category: "admin",
    phase: "launch",
    difficulty: "easy",
    timeEstimate: "1 day",
    resources: ["02_TEACHER_IMPLEMENTATION_GUIDE.md#13-space-assessment", "04_SAFETY_SOPS_AND_RISK_ASSESSMENT.md"],
    completed: false,
    required: true,
  },
  {
    id: "budget-tier",
    title: "Select Budget Tier & Approve Funding",
    description: "Choose Core ($500-1K) / FabLab ($2.5-5K) / Center ($10K+), secure PTA/grant/budget approval",
    category: "admin",
    phase: "launch",
    difficulty: "medium",
    timeEstimate: "2-4 weeks",
    resources: ["13_PROCUREMENT_PAYMENT_AND_FINANCE_PLAYBOOK.md", "08_GRANT_AND_FUNDRAISING_TEMPLATES.md"],
    completed: false,
    required: true,
  },
  {
    id: "safety-mou",
    title: "Sign Safety MOU",
    description: "Review and sign Safety Memorandum of Understanding with admin and teacher leads",
    category: "admin",
    phase: "launch",
    difficulty: "easy",
    timeEstimate: "30 min",
    resources: ["04_SAFETY_SOPS_AND_RISK_ASSESSMENT.md", "02_TEACHER_IMPLEMENTATION_GUIDE.md Appendix A"],
    completed: false,
    required: true,
  },

  // BUILD PHASE
  {
    id: "order-equipment",
    title: "Order Equipment & Materials",
    description: "Place POs for heat press, shredder, PPE, sensors, consumables per procurement planner",
    category: "teacher",
    phase: "build",
    difficulty: "medium",
    timeEstimate: "1-2 weeks",
    resources: ["03_COMMAND_CENTER_SHEETS.md Tab 2", "30_SUPPLIER_AND_PARTNER_DIRECTORY.md"],
    completed: false,
    required: true,
  },
  {
    id: "build-boxes",
    title: "Build Collection Boxes",
    description: "Laser-cut or hand-build 5+ collection boxes from cad/collection_box.scad, deploy to zones",
    category: "teacher",
    phase: "build",
    difficulty: "medium",
    timeEstimate: "1 week",
    resources: ["cad/collection_box.scad", "14_ASSET_CAD_AND_TOOLS_INDEX.md", "19_LAUNCH_WEEK_AND_COMMUNICATIONS_KIT.md"],
    completed: false,
    required: true,
  },
  {
    id: "safety-certification",
    title: "Complete Safety Certifications",
    description: "All machine operators pass quizzes + practical demos for Heat Press, Shredder, Laser (if applicable)",
    category: "teacher",
    phase: "build",
    difficulty: "hard",
    timeEstimate: "2-4 hours",
    resources: ["17_CERTIFICATION_AND_TRAINING_PACK.md", "04_SAFETY_SOPS_AND_RISK_ASSESSMENT.md"],
    completed: false,
    required: true,
  },
  {
    id: "deploy-sensors",
    title: "Deploy IoT Sensors (FabLab+)",
    description: "Flash ESP32 firmware, configure WiFi/Supabase, mount IR sensors in boxes, test dashboard",
    category: "teacher",
    phase: "build",
    difficulty: "hard",
    timeEstimate: "1 week",
    resources: ["29_IOT_AND_LIVE_TRACKING.md", "FIRMWARE_AND_IOT_GUIDE.md", "firmware/"],
    completed: false,
    required: false,
  },
  {
    id: "command-center",
    title: "Set Up Command Center",
    description: "Create Google Sheets workbook with 8 tabs, import CSVs, build charts, share with team",
    category: "teacher",
    phase: "build",
    difficulty: "easy",
    timeEstimate: "2 hours",
    resources: ["03_COMMAND_CENTER_SHEETS.md", "csv/", "16_WEBSITE_AND_DASHBOARD_DEPLOYMENT.md"],
    completed: false,
    required: true,
  },
  {
    id: "recruit-students",
    title: "Recruit Student Leads",
    description: "Run application process for 7 roles: Collection Captain, Wash Lead, Shredder Op, Press Op, Design, Data, Business",
    category: "student",
    phase: "build",
    difficulty: "easy",
    timeEstimate: "1 week",
    resources: ["09_STUDENT_ROLE_CARDS_AND_SCHEDULING.md", "15_FORMS_AND_PERMISSIONS_PACK.md"],
    completed: false,
    required: true,
  },

  // PROCESS PHASE
  {
    id: "first-collection",
    title: "Run First Collection Cycle",
    description: "Friday pickup → weigh → log → wash → dry 24hrs → shred → sieve → first flake batch",
    category: "operations",
    phase: "process",
    difficulty: "medium",
    timeEstimate: "1 week",
    resources: ["02_TEACHER_IMPLEMENTATION_GUIDE.md Ch3", "05_PRINTABLE_RESOURCES.md log sheets"],
    completed: false,
    required: true,
  },
  {
    id: "first-press",
    title: "Complete First Heat Press Run",
    description: "Flakes → parchment sandwich → 140°C HDPE / 170°C PP → 5+5+5 min → cool under weight → QC",
    category: "operations",
    phase: "process",
    difficulty: "hard",
    timeEstimate: "2 hours",
    resources: ["04_SAFETY_SOPS_AND_RISK_ASSESSMENT.md#21-heat-press-sop", "10_PRODUCT_DEVELOPMENT_AND_QC.md"],
    completed: false,
    required: true,
  },
  {
    id: "qc-process",
    title: "Establish QC Process",
    description: "Student-signed batch checklist: flake size, thickness ±0.5mm, no burns, smooth edges, branding, batch log",
    category: "operations",
    phase: "process",
    difficulty: "medium",
    timeEstimate: "1 hour setup",
    resources: ["10_PRODUCT_DEVELOPMENT_AND_QC.md", "01_LAUNCH_DECK_PRESENTATION.md Slide 27"],
    completed: false,
    required: true,
  },
  {
    id: "weekly-rhythm",
    title: "Establish Weekly Rhythm",
    description: "Mon-Thu collect, Fri process, Mon press, Tue QC, Wed design, Thu package, Fri sell/report",
    category: "operations",
    phase: "process",
    difficulty: "medium",
    timeEstimate: "Ongoing",
    resources: ["18_LESSON_PLAN_LIBRARY.md", "24_ENGAGEMENT_AND_GAMIFICATION_GUIDE.md"],
    completed: false,
    required: true,
  },

  // PRODUCT PHASE
  {
    id: "design-sprint",
    title: "Run Design Sprint",
    description: "Students design coasters/keychains in Tinkercad/Fusion 360, vote on top 3, create prototypes",
    category: "teacher",
    phase: "product",
    difficulty: "medium",
    timeEstimate: "2 weeks",
    resources: ["10_PRODUCT_DEVELOPMENT_AND_QC.md", "14_ASSET_CAD_AND_TOOLS_INDEX.md", "cad/"],
    completed: false,
    required: true,
  },
  {
    id: "mold-making",
    title: "Make Production Molds",
    description: "3D print or CNC mill aluminum molds for coasters, keychains, organizers per design specs",
    category: "teacher",
    phase: "product",
    difficulty: "hard",
    timeEstimate: "1-2 weeks",
    resources: ["cad/coaster_press_frame.scad", "cad/keychain_mold.scad", "10_PRODUCT_DEVELOPMENT_AND_QC.md"],
    completed: false,
    required: true,
  },
  {
    id: "branding-packaging",
    title: "Create Branding & Packaging",
    description: "Logo, product names, tags, boxes, price cards, social media templates, QR codes to dashboard",
    category: "teacher",
    phase: "product",
    difficulty: "easy",
    timeEstimate: "1 week",
    resources: ["21_ECO_STORE_OPERATIONS_MANUAL.md", "19_LAUNCH_WEEK_AND_COMMUNICATIONS_KIT.md"],
    completed: false,
    required: false,
  },
  {
    id: "product-photography",
    title: "Product Photography",
    description: "Styled photos for each product line: hero shots, lifestyle, detail, scale reference for store/website",
    category: "student",
    phase: "product",
    difficulty: "easy",
    timeEstimate: "2 hours",
    resources: ["32_DIGITAL_PRODUCTS_AND_ONLINE_STORE.md", "21_ECO_STORE_OPERATIONS_MANUAL.md"],
    completed: false,
    required: false,
  },

  // MARKET PHASE
  {
    id: "eco-store-launch",
    title: "Launch Eco-Store",
    description: "Pop-up at lunch, parent night, online pre-orders, POS system, cash handling, inventory tracking",
    category: "operations",
    phase: "market",
    difficulty: "medium",
    timeEstimate: "1 week prep",
    resources: ["21_ECO_STORE_OPERATIONS_MANUAL.md", "15_FORMS_AND_PERMISSIONS_PACK.md"],
    completed: false,
    required: true,
  },
  {
    id: "first-sales",
    title: "Achieve First $100 in Sales",
    description: "Sell first batch, log in Command Center Tab 6, calculate margins, reinvest in consumables",
    category: "operations",
    phase: "market",
    difficulty: "easy",
    timeEstimate: "Launch day",
    resources: ["03_COMMAND_CENTER_SHEETS.md Tab 6", "21_ECO_STORE_OPERATIONS_MANUAL.md"],
    completed: false,
    required: true,
  },
  {
    id: "impact-report-v1",
    title: "Publish Impact Report v1",
    description: "Semester report: caps, kg, CO2e, revenue, students, products — share with admin, parents, funders",
    category: "admin",
    phase: "market",
    difficulty: "medium",
    timeEstimate: "4 hours",
    resources: ["23_IMPACT_REPORTING_TEMPLATES.md", "03_COMMAND_CENTER_SHEETS.md Tab 7"],
    completed: false,
    required: true,
  },
  {
    id: "press-release",
    title: "Send Press Release",
    description: "Local media outreach with photos, student quotes, impact stats, dashboard link, event invites",
    category: "admin",
    phase: "market",
    difficulty: "easy",
    timeEstimate: "2 hours",
    resources: ["19_LAUNCH_WEEK_AND_COMMUNICATIONS_KIT.md", "08_GRANT_AND_FUNDRAISING_TEMPLATES.md"],
    completed: false,
    required: false,
  },

  // SCALE PHASE
  {
    id: "reflection-docs",
    title: "Document Lessons Learned",
    description: "Team retrospective: what worked, what didn't, process improvements, supplier feedback, student quotes",
    category: "teacher",
    phase: "scale",
    difficulty: "easy",
    timeEstimate: "2 hours",
    resources: ["27_CONTINUITY_AND_HANDOVER_GUIDE.md", "22_TEACHER_PD_AND_ONBOARDING_GUIDE.md"],
    completed: false,
    required: true,
  },
  {
    id: "train-next-cohort",
    title: "Train Next Student Cohort",
    description: "Outgoing leads train incoming leads on all roles, certifications, documentation, culture",
    category: "student",
    phase: "scale",
    difficulty: "medium",
    timeEstimate: "2 weeks",
    resources: ["31_TRAIN_THE_TRAINER_AND_AMBASSADOR_PROGRAM.md", "27_CONTINUITY_AND_HANDOVER_GUIDE.md"],
    completed: false,
    required: true,
  },
  {
    id: "grant-application",
    title: "Submit Grant Application",
    description: "Use Year 1 data to apply for Erasmus+, local foundation, corporate sponsorship for Year 2 expansion",
    category: "admin",
    phase: "scale",
    difficulty: "hard",
    timeEstimate: "2-4 weeks",
    resources: ["08_GRANT_AND_FUNDRAISING_TEMPLATES.md", "26_DISTRICT_SCALE_AND_REPLICATION_GUIDE.md"],
    completed: false,
    required: false,
  },
  {
    id: "district-replication",
    title: "Plan District Replication",
    description: "Hub-and-spoke model: identify 3-5 spoke schools, shared equipment schedule, trainer network",
    category: "admin",
    phase: "scale",
    difficulty: "hard",
    timeEstimate: "1-3 months",
    resources: ["26_DISTRICT_SCALE_AND_REPLICATION_GUIDE.md", "31_TRAIN_THE_TRAINER_AND_AMBASSADOR_PROGRAM.md"],
    completed: false,
    required: false,
  },
];

const CATEGORY_LABELS: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  admin: { label: "Admin", icon: Shield, color: "bg-blue-100 text-blue-800" },
  teacher: { label: "Teacher", icon: BookOpen, color: "bg-green-100 text-green-800" },
  student: { label: "Student", icon: Users, color: "bg-purple-100 text-purple-800" },
  operations: { label: "Ops", icon: Wrench, color: "bg-orange-100 text-orange-800" },
  scaling: { label: "Scaling", icon: Target, color: "bg-indigo-100 text-indigo-800" },
};

const DIFFICULTY_COLORS = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

export default function ImplementationKit() {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    if (typeof window === "undefined") return CHECKLIST;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return CHECKLIST.map(item => ({
          ...item,
          completed: parsed[item.id] ?? false,
        }));
      }
    } catch (e) {
      console.error("Failed to load progress:", e);
    }
    return CHECKLIST;
  });

  const [expandedPhases, setExpandedPhases] = useState<string[]>(["launch"]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPhase, setFilterPhase] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [exportData, setExportData] = useState<string>("");

  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const progress: Record<string, boolean> = {};
    items.forEach(item => {
      progress[item.id] = item.completed;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [items]);

  const toggleItem = useCallback((id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  }, []);

  const togglePhase = useCallback((phase: string) => {
    setExpandedPhases(prev =>
      prev.includes(phase) ? prev.filter(p => p !== phase) : [...prev, phase]
    );
  }, []);

  const resetProgress = useCallback(() => {
    if (confirm("Reset all progress? This cannot be undone.")) {
      setItems(CHECKLIST.map(item => ({ ...item, completed: false })));
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const exportProgress = useCallback(() => {
    const data = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      items: items.map(item => ({
        id: item.id,
        completed: item.completed,
        completedAt: item.completed ? new Date().toISOString() : null,
      })),
      summary: {
        total: items.length,
        completed: items.filter(i => i.completed).length,
        requiredCompleted: items.filter(i => i.required && i.completed).length,
        requiredTotal: items.filter(i => i.required).length,
      },
    };
    const json = JSON.stringify(data, null, 2);
    setExportData(json);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cap-collective-progress-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [items]);

  const importProgress = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.items) {
          const imported: Record<string, boolean> = {};
          data.items.forEach((item: { id: string; completed: boolean }) => {
            imported[item.id] = item.completed;
          });
          setItems(prev => prev.map(item => ({
            ...item,
            completed: imported[item.id] ?? item.completed,
          })));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
        }
      } catch (err) {
        alert("Invalid file format");
      }
    };
    reader.readAsText(file);
  }, []);

  const phaseProgress: Record<string, PhaseProgress> = {};
  PHASES.forEach(p => {
    const phaseItems = items.filter(i => i.phase === p.key);
    phaseProgress[p.key] = {
      phase: p.key,
      total: phaseItems.length,
      completed: phaseItems.filter(i => i.completed).length,
    };
  });

  const totalItems = items.length;
  const completedItems = items.filter(i => i.completed).length;
  const requiredItems = items.filter(i => i.required).length;
  const requiredCompleted = items.filter(i => i.required && i.completed).length;
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const requiredProgress = requiredItems > 0 ? Math.round((requiredCompleted / requiredItems) * 100) : 0;

  const filteredItems = items.filter(item => {
    if (filterCategory !== "all" && item.category !== filterCategory) return false;
    if (filterPhase !== "all" && item.phase !== filterPhase) return false;
    if (!showCompleted && item.completed) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cap Collective Implementation Kit</h1>
                  <p className="text-gray-600 dark:text-gray-300">Visual progress tracker with local persistence</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="gap-1">
                  <Heart className="w-3 h-3" /> Student-Led
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Award className="w-3 h-3" /> Standards-Aligned
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Star className="w-3 h-3" /> Revenue-Generating
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Globe className="w-3 h-3" /> Open Source
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={exportProgress} disabled={exportData !== ""}>
                <Download className="w-4 h-4 mr-2" /> Export Progress
              </Button>
              <Button variant="outline" onClick={() => document.getElementById("import-file")?.click()}>
                <Upload className="w-4 h-4 mr-2" /> Import
              </Button>
              <Button variant="danger" onClick={resetProgress}>
                <RefreshCw className="w-4 h-4 mr-2" /> Reset All
              </Button>
              <input
                id="import-file"
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && importProgress(e.target.files[0])}
              />
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">Overall Progress</span>
                <span className="text-2xl font-bold text-green-700 dark:text-green-300">{overallProgress}%</span>
              </div>
              <ProgressBar value={overallProgress} className="h-2" />
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">{completedItems} of {totalItems} tasks complete</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Required Tasks</span>
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{requiredProgress}%</span>
              </div>
              <ProgressBar value={requiredProgress} className="h-2" />
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{requiredCompleted} of {requiredItems} required</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Phases Ready</span>
                <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {Object.values(phaseProgress).filter(p => p.completed === p.total && p.total > 0).length} / {PHASES.length}
                </span>
              </div>
              <ProgressBar value={Object.values(phaseProgress).filter(p => p.completed === p.total && p.total > 0).length / PHASES.length * 100} className="h-2" />
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Phases fully complete</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Current Phase</span>
                <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {PHASES.find(p => phaseProgress[p.key]?.completed > 0 && phaseProgress[p.key]?.completed < phaseProgress[p.key]?.total)?.label || "Not Started"}
                </span>
              </div>
              <div className="h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${PHASES.findIndex(p => phaseProgress[p.key]?.completed > 0 && phaseProgress[p.key]?.completed < phaseProgress[p.key]?.total) / PHASES.length * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="admin">🛡️ Admin</option>
                <option value="teacher">📚 Teacher</option>
                <option value="student">👥 Student</option>
                <option value="operations">⚙️ Operations</option>
                <option value="scaling">🎯 Scaling</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Phase</label>
              <select
                value={filterPhase}
                onChange={(e) => setFilterPhase(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Phases</option>
                {PHASES.map(p => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer self-end">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Show completed tasks</span>
            </label>
          </div>
        </div>

        {/* Phase Sections */}
        <div className="space-y-4">
          {PHASES.map((phaseConfig) => {
            const progress = phaseProgress[phaseConfig.key];
            const phaseItems = filteredItems.filter(i => i.phase === phaseConfig.key);
            const isExpanded = expandedPhases.includes(phaseConfig.key);
            const PhaseIcon = phaseConfig.icon;

            if (phaseItems.length === 0) return null;

            return (
              <div key={phaseConfig.key} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => togglePhase(phaseConfig.key)}
                  className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${phaseConfig.color}`}>
                    <PhaseIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Phase {PHASES.findIndex(p => p.key === phaseConfig.key) + 1}: {phaseConfig.label}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{phaseConfig.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <ProgressBar value={progress.total > 0 ? (progress.completed / progress.total) * 100 : 0} className="h-2" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-20 text-right">
                      {progress.completed}/{progress.total}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${progress.completed === progress.total && progress.total > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>
                      {progress.completed === progress.total && progress.total > 0 ? "Complete" : "In Progress"}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="space-y-3 mt-4">
                      {phaseItems.map((item) => (
                        <ChecklistItemCard
                          key={item.id}
                          item={item}
                          onToggle={() => toggleItem(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Export Modal */}
        {exportData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setExportData("")}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[60vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Export Progress Data</h3>
                <button onClick={() => setExportData("")} className="text-gray-400 hover:text-gray-600">×</button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Copy this JSON to backup or share your progress:</p>
              <textarea
                value={exportData}
                readOnly
                className="w-full h-64 font-mono text-xs p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-2 mt-4 justify-end">
                <Button onClick={() => { navigator.clipboard.writeText(exportData); alert("Copied!"); }}>Copy to Clipboard</Button>
                <Button variant="outline" onClick={() => setExportData("")}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ChecklistItemCardProps {
  item: ChecklistItem;
  onToggle: () => void;
}

function ChecklistItemCard({ item, onToggle }: ChecklistItemCardProps) {
  const cat = CATEGORY_LABELS[item.category];
  const CategoryIcon = cat.icon;
  const difficultyColor = DIFFICULTY_COLORS[item.difficulty];

  return (
    <div className={`group relative p-4 rounded-xl border transition-all ${item.completed ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700"}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.completed ? "bg-green-500 border-green-500" : "border-gray-300 dark:border-gray-600 hover:border-green-400"}`}
          aria-label={item.completed ? "Mark incomplete" : "Mark complete"}
        >
          {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
            {item.required && <Badge variant="outline" className="gap-1"><Star className="w-3 h-3" /> Required</Badge>}
            <Badge className={cat.color}><CategoryIcon className="w-3 h-3" /> {cat.label}</Badge>
            <Badge className={difficultyColor}>{item.difficulty}</Badge>
            <Badge variant="outline" className="text-xs"><Clock className="w-3 h-3" /> {item.timeEstimate}</Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{item.description}</p>

          <div className="flex flex-wrap gap-2">
            {item.resources.slice(0, 3).map((resource, idx) => (
              <Badge key={idx} variant="outline" className="text-xs gap-1">
                <BookOpen className="w-2.5 h-2.5" />
                {resource.length > 30 ? resource.substring(0, 30) + "…" : resource}
              </Badge>
            ))}
            {item.resources.length > 3 && (
              <Badge variant="outline" className="text-xs text-gray-500">+{item.resources.length - 3} more</Badge>
            )}
          </div>
        </div>

        <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
      </div>
    </div>
  );
}