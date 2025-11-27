import { useState, useEffect, useRef, useCallback } from 'react';

export const useScrollToBottom = (dependency: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Scroll to bottom smoothly
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
      setIsUserScrolling(false);
    }
  }, []);

  // Check if user is near bottom
  const isNearBottom = useCallback(() => {
    if (!scrollRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const isAtBottom = isNearBottom();
    setShowScrollButton(!isAtBottom);

    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set user as scrolling
    setIsUserScrolling(true);

    // After 150ms of no scrolling, check if we're at bottom
    scrollTimeoutRef.current = setTimeout(() => {
      if (isAtBottom) {
        setIsUserScrolling(false);
      }
    }, 150);
  }, [isNearBottom]);

  // Auto-scroll on new messages (only if user is not scrolling up)
  useEffect(() => {
    if (!isUserScrolling && dependency) {
      scrollToBottom('smooth');
    }
  }, [dependency, isUserScrolling, scrollToBottom]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollRef,
    showScrollButton,
    scrollToBottom,
    handleScroll,
  };
};
