// components/mobile-sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar"; // Make sure the path is correct

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  // Close sidebar when pressing escape
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMobileMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent scrolling when sidebar is open
      document.body.style.overflow = 'hidden';
    }

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      // Restore scrolling when component unmounts or isOpen becomes false
      document.body.style.overflow = '';
    };
  }, [isOpen]); // Dependency array ensures effect runs only when isOpen changes

  return (
    <>
      {/* Menu Button (visible only on smaller screens) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-md hover:bg-accent transition-colors" // md:hidden hides it on medium screens and up
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar Overlay and Content (conditionally rendered) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden"> {/* md:hidden ensures this only appears on smaller screens */}
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu} // Close menu when clicking backdrop
            aria-hidden="true" // Good for accessibility
          />

          {/* Sidebar Panel */}
          {/* Added animate-in/out classes for smoother transitions (requires tailwindcss-animate) */}
          <div className="fixed inset-y-0 left-0 w-64 bg-background border-r animate-in slide-in-from-left duration-300 ease-out">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-md hover:bg-accent transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Pass only the closeMobileMenu prop */}
            <Sidebar closeMobileMenu={closeMobileMenu} />
          </div>
        </div>
      )}
    </>
  );
}