"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CALENDLY_URL = "https://calendly.com/treetor/master-tech-session";
const WIDGET_URL = "https://assets.calendly.com/assets/external/widget.js";

// Detect if we're on localhost (where Calendly widget won't work)
const isLocalhost = typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

declare global {
  interface Window {
    Calendly: {
      initPopupWidget: (options: { url: string }) => void;
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
      destroy: () => void;
    };
  }
}

export function CalendlyPopupButton({
  children,
  className = "",
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const scriptLoadedRef = useRef(false);
  const widgetWorksRef = useRef(false);

  // Load Calendly widget script once on mount (non-blocking)
  useEffect(() => {
    if (isLocalhost) {
      // On localhost, widget won't work - skip loading
      scriptLoadedRef.current = true;
      widgetWorksRef.current = false;
      return;
    }

    if (window.Calendly) {
      scriptLoadedRef.current = true;
      widgetWorksRef.current = true;
      return;
    }

    // Check if script already in DOM
    if (document.querySelector(`script[src="${WIDGET_URL}"]`)) {
      const checkReady = setInterval(() => {
        if (window.Calendly) {
          scriptLoadedRef.current = true;
          widgetWorksRef.current = true;
          clearInterval(checkReady);
        }
      }, 100);
      return () => clearInterval(checkReady);
    }

    const script = document.createElement("script");
    script.src = WIDGET_URL;
    script.async = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      widgetWorksRef.current = true;
    };
    script.onerror = () => {
      scriptLoadedRef.current = true;
      widgetWorksRef.current = false;
    };
    document.body.appendChild(script);
  }, []);

  const openPopup = useCallback(() => {
    if (isLoading) return;

    // On localhost or if widget known to fail: direct link (no hang)
    if (isLocalhost || scriptLoadedRef.current && !widgetWorksRef.current) {
      window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
      return;
    }

    // Widget ready: open popup
    if (window.Calendly) {
      try {
        window.Calendly.initPopupWidget({ url: CALENDLY_URL });
        return;
      } catch {
        // Widget failed - mark and fallback
        widgetWorksRef.current = false;
        window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
        return;
      }
    }

    // Script still loading: show spinner, wait briefly, then fallback
    setIsLoading(true);
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds
    const checkInterval = setInterval(() => {
      attempts++;
      if (window.Calendly) {
        clearInterval(checkInterval);
        setIsLoading(false);
        try {
          window.Calendly.initPopupWidget({ url: CALENDLY_URL });
          widgetWorksRef.current = true;
        } catch {
          widgetWorksRef.current = false;
          window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        setIsLoading(false);
        widgetWorksRef.current = false;
        window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
      }
    }, 100);

    // Cleanup
    return () => clearInterval(checkInterval);
  }, [isLoading]);

  return (
    <button
      type="button"
      onClick={openPopup}
      disabled={disabled || isLoading}
      className={className}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block animate-spin mr-2">⏳</span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function CalendlyInline({
  url = CALENDLY_URL,
  height = 630,
  className = ""
}: { url?: string; height?: number; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLocalhost) {
      // Don't try inline embed on localhost
      return;
    }

    const initWidget = () => {
      if (window.Calendly && containerRef.current) {
        window.Calendly.initInlineWidget({
          url,
          parentElement: containerRef.current,
        });
        setIsLoaded(true);
      }
    };

    if (window.Calendly) {
      initWidget();
    } else {
      const script = document.createElement("script");
      script.src = WIDGET_URL;
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    }

    return () => {
      if (window.Calendly) {
        window.Calendly.destroy();
      }
    };
  }, [url]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minWidth: 320, height }}
    />
  );
}