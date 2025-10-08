"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect user's motion preference
 * Returns true if user prefers reduced motion
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Skip to main content link for screen readers and keyboard navigation
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-accent focus:text-accent-foreground focus:rounded-lg focus:shadow-glow focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}

/**
 * Announce to screen readers when route changes
 */
export function RouteAnnouncer() {
  const [routeAnnouncement, setRouteAnnouncement] = useState("");

  useEffect(() => {
    const handleRouteChange = () => {
      const title = document.title;
      setRouteAnnouncement(`Navigated to ${title}`);
    };

    // Listen for route changes
    const observer = new MutationObserver(() => {
      handleRouteChange();
    });

    observer.observe(document.querySelector("title")!, {
      childList: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {routeAnnouncement}
    </div>
  );
}

/**
 * Focus trap for modals and dialogs
 */
export function useFocusTrap(ref: React.RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener("keydown", handleTabKey);
    };
  }, [ref, isActive]);
}

/**
 * Escape key handler for modals and dialogs
 */
export function useEscapeKey(callback: () => void, isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        callback();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [callback, isActive]);
}

/**
 * Keyboard navigation for custom components
 */
export function useArrowKeyNavigation(
  itemsRef: React.RefObject<HTMLElement[]>,
  isActive: boolean
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const handleArrowKey = (e: KeyboardEvent) => {
      const items = itemsRef.current;
      if (!items || items.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          setCurrentIndex((prev) => (prev + 1) % items.length);
          items[(currentIndex + 1) % items.length]?.focus();
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
          items[(currentIndex - 1 + items.length) % items.length]?.focus();
          break;
        case "Home":
          e.preventDefault();
          setCurrentIndex(0);
          items[0]?.focus();
          break;
        case "End":
          e.preventDefault();
          setCurrentIndex(items.length - 1);
          items[items.length - 1]?.focus();
          break;
      }
    };

    document.addEventListener("keydown", handleArrowKey);
    return () => document.removeEventListener("keydown", handleArrowKey);
  }, [itemsRef, isActive, currentIndex]);

  return currentIndex;
}
