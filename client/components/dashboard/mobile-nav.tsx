import { List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TabValue } from "@/types/profile.types";
import { TABS } from "@/constants/profile.constants";

interface MobileNavProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

export const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => (
  <Select value={activeTab} onValueChange={(v) => onTabChange(v as TabValue)}>
    <SelectTrigger className="w-full bg-card shadow-sm">
      <List className="h-4 w-4 mr-2" />
      <SelectValue placeholder="Select a setting tab" />
    </SelectTrigger>
    <SelectContent>
      {TABS.map((tab) => (
        <SelectItem key={tab.value} value={tab.value}>
          {tab.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
