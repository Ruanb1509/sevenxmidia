import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import UserMenu from "./UserMenu";
import useAuth from "../hooks/useAuth";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  // Evita ícone errado no primeiro render (next-themes só resolve no client)
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;

  const isDark = theme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      data-testid="theme-toggle"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

const Header = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            data-testid="logo-link"
          >
            {/* Logo original (PNG transparente). dark:invert deixa os
                traços pretos brancos no tema escuro. */}
            <img
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt=""
              aria-hidden="true"
              className="h-9 w-9 shrink-0 dark:invert"
            />
            SevenX Media
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
              data-testid="pricing-nav-link"
            >
              Pricing
            </a>
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors"
              data-testid="home-nav-link"
            >
              Home
            </Link>
          </div>

          {/* Right Section - Theme + Authentication */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {loading ? (
              <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid="login-button"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    data-testid="register-button"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
