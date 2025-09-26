import { useEffect } from "react";

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  useEffect(() => {
    // Prevent script from running in development or if it already exists
    if (
      import.meta.env.VITE_ENVIRONMENT !== "production" ||
      document.querySelector(`script[src*="${gaId}"]`)
    ) {
      return;
    }

    // Create the main GA script element
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script1);

    // Create the inline script element for initialization
    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(script2);

    // Cleanup function to remove scripts when the component unmounts
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [gaId]);

  return null; // This component does not render anything
}
