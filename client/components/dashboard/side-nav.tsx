import { TABS } from "@/constants/profile.constants";
import { TabValue } from "@/types/profile.types";

interface SideNavProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

export const SideNav = ({ activeTab, onTabChange }: SideNavProps) => (
  <nav className="p-4 space-y-2 bg-card rounded-xl shadow-lg md:shadow-none">
    <h3 className="text-lg font-semibold text-foreground hidden md:block border-b border-border pb-2 mb-3">
      Settings
    </h3>
    {TABS.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.value;
      return (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-sm font-medium ${
            isActive
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-foreground hover:bg-accent"
          }`}
        >
          <Icon className="h-5 w-5" />
          <span className="truncate">{tab.label}</span>
        </button>
      );
    })}
  </nav>
);
