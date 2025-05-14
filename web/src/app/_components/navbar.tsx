"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "~/components/logo";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [{ href: "/dashboard", label: "Dashboard" }];

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-morphism py-3" : "bg-transparent py-5"
      }`}
      role="banner"
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center space-x-2"
          aria-label="Scrapebun"
        >
          <Logo width={40} height={40} />
          <span className="text-xl font-bold text-white">Scrapebun</span>
        </Link>

        <nav
          className="hidden items-center space-x-6 md:flex"
          role="navigation"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </nav>

        <button
          className="text-white md:hidden"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-menu"
          className="glass-morphism md:hidden"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col space-y-3 px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-white"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex justify-center">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            </SignedIn>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
