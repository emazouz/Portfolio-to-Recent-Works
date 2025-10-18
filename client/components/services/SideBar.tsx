// ============================================
// SIDEBAR COMPONENT
// ============================================

import { CheckCircle2, Clock, Download, MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SERVICES } from "@/constants/services";
import { useScrollPosition } from "@/hooks/use-scroll-position";

interface SideBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  activeSection: string;
}

export const SideBar = ({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
}: SideBarProps) => {
  const scrollY = useScrollPosition();
  const sidebarRef = useRef<HTMLElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isStickyFooter, setIsStickyFooter] = useState(false);
  const HERO_BANNER_HEIGHT = 490;
  const Footer_BANNER_HEIGHT = 7213;

  useEffect(() => {
    setIsSticky(scrollY > HERO_BANNER_HEIGHT);
    setIsStickyFooter(scrollY > Footer_BANNER_HEIGHT);
  }, [scrollY]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setSidebarOpen(false);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-red-400 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`w-[330px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 z-40 transition-all duration-300 overflow-y-auto shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0 ${
          isSticky
            ? isStickyFooter
              ? "absolute bottom-0"
              : "fixed top-12 bottom-0"
            : "absolute top-0"
        } right-0`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-200 lg:hidden z-50"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-12 space-y-6">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Services
            </h2>
            <p className="text-sm text-slate-400 mt-1">Choose your solution</p>
          </div>

          <nav
            className="space-y-2"
            role="navigation"
            aria-label="Service navigation"
          >
            {SERVICES.map((service) => {
              const Icon = service.icon;
              const isActive = activeSection === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => scrollToSection(service.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left group ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/50 text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg transition-all ${
                      isActive
                        ? `bg-gradient-to-br ${service.gradient}`
                        : "bg-slate-800 group-hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold">{service.label}</span>
                  {isActive && (
                    <CheckCircle2 className="w-4 h-4 ml-auto text-indigo-400" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Download className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-sm">Services Guide</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Comprehensive 12-page catalog with detailed pricing
            </p>
            <button className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-3xl" role="img" aria-label="Developer">
                👨‍💻
              </span>
            </div>
            <h3 className="font-bold text-white mb-2">
              Available for Projects
            </h3>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-4">
              <Clock className="w-4 h-4" />
              <span>Response: &lt;24hrs</span>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 shadow-lg">
              <MessageCircle className="w-5 h-5" />
              WhatsApp Chat
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};


