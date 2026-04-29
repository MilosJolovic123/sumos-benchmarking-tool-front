import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import logoFull from "@/assets/logo-full.png";

const navItems = [
  { label: "SURVEY", path: "/survey" },
  { label: "BENCHMARK", path: "/benchmark" },
  { label: "STATISTICS", path: "/statistics" },
  { label: "TIPS AND TRICKS", path: "/suggestions" },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background shadow-[0_4px_68px_rgba(0,0,0,0.08)]">
      <div className="container flex h-28 items-center justify-between px-10 lg:px-40">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logoFull} alt="SuMoS - Strengthening the ecosystem for sustainable student mobility" className="h-20 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 md:flex h-28">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex h-full items-center px-4 text-sm font-normal tracking-wider uppercase transition-colors",
                  isActive
                    ? "text-secondary font-semibold border-b-2 border-secondary"
                    : "text-primary hover:text-secondary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-background p-4 md:hidden">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-4 py-3 text-sm font-semibold tracking-wider uppercase",
                location.pathname.startsWith(item.path)
                  ? "text-secondary border-l-2 border-secondary"
                  : "text-primary hover:text-secondary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
