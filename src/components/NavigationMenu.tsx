import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { 
  Home, 
  LineChart, 
  Calculator, 
  Moon, 
  TrendingUp, 
  Settings, 
  BarChart3,
  Activity,
  Globe,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Charts", url: "/charts", icon: LineChart },
  { title: "Analysis", url: "/analysis", icon: BarChart3 },
  { title: "Planetary", url: "/planetary", icon: Moon },
  { title: "Signals", url: "/signals", icon: Activity },
];

const toolsItems = [
  { title: "Gann Calculator", url: "/tools/gann-calc" },
  { title: "Time Cycles", url: "/tools/time-cycles" },
  { title: "Pattern Scanner", url: "/tools/patterns" },
  { title: "Options Calculator", url: "/tools/options" },
];

export const NavigationMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border/40 bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary animate-pulse-glow" />
            <span className="text-xl font-bold gradient-text">Gann Navigator</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-all hover-lift"
                activeClassName="bg-primary/10 text-primary font-medium"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            ))}

            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-md transition-all hover-lift hover:bg-muted">
                <Calculator className="h-4 w-4" />
                <span>Tools</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {toolsItems.map((tool) => (
                  <DropdownMenuItem key={tool.url} asChild>
                    <NavLink to={tool.url} className="w-full cursor-pointer">
                      {tool.title}
                    </NavLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink
              to="/settings"
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-all hover-lift"
              activeClassName="bg-primary/10 text-primary font-medium"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <BarChart3 className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            {navigationItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                className="flex items-center gap-2 px-4 py-3 rounded-md transition-all"
                activeClassName="bg-primary/10 text-primary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
