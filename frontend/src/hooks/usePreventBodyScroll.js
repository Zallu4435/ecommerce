import { useEffect } from 'react';

/**
 * Custom hook to prevent body scrolling when a modal is open
 * @param {boolean} isOpen - Whether the modal is open or not
 */
export const usePreventBodyScroll = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Get the scroll position
      const scrollY = document.body.style.top;
      
      // Re-enable scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);
};

export default usePreventBodyScroll;
