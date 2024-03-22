import { useEffect } from "react";

/**
 * This will turn the page in portrait or landscape depending on the number of pages
 */
const usePageOrientation = () => {
  useEffect(() => {
    const updatePageOrientation = () => {
      const pages = document.querySelectorAll(".comic-page");
      const styleEl = document.createElement("style");

      // Append style element to the head
      document.head.appendChild(styleEl);

      // Get the style sheet created in the above step
      const styleSheet = styleEl.sheet as CSSStyleSheet;

      if (pages.length >= 2) {
        styleSheet.insertRule("@page { size: landscape }", 0);
      } else {
        styleSheet.insertRule("@page { size: portrait }", 0);
      }
    };

    // Execute when the DOM is fully loaded 
    updatePageOrientation();

    // Also execute when the window is resized
    window.addEventListener("resize", updatePageOrientation);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", updatePageOrientation);
    };
  }, []);  // Empty dependency array ensures this runs once on mount and cleanup on unmount
};

export default usePageOrientation;