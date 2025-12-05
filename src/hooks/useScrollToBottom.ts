import { useState, useEffect, useRef, useCallback } from 'react';

// Easing function for smooth animation (easeOutCubic)
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const useScrollToBottom = (dependency: unknown) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastScrollTopRef = useRef<number>(0);
  const userScrolledUpRef = useRef<boolean>(false);

  // Animated scroll to bottom with custom easing
  const animatedScrollToBottom = useCallback((duration: number = 400) => {
    if (!scrollRef.current) return;

    const element = scrollRef.current;
    const start = element.scrollTop;
    const target = element.scrollHeight - element.clientHeight;
    const distance = target - start;
    
    // If already at bottom or very close, skip animation
    if (Math.abs(distance) < 10) return;

    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutCubic(progress);
      
      element.scrollTop = start + (distance * easeProgress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      }
    };

    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(animateScroll);
    setIsUserScrolling(false);
  }, []);

  // Scroll to bottom (can use native smooth or custom animation)
  // This is for EXPLICIT user action (like clicking button or sending message)
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    // Reset the userScrolledUp flag when explicitly scrolling to bottom
    userScrolledUpRef.current = false;
    
    if (behavior === 'smooth') {
      animatedScrollToBottom(500); // 500ms for a nice smooth animation
    } else {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'instant',
        });
        setIsUserScrolling(false);
      }
    }
  }, [animatedScrollToBottom]);

  // Scroll to bottom only if user hasn't scrolled up
  // This is for AUTOMATIC scroll (like content change, new messages)
  const scrollToBottomIfNotScrolledUp = useCallback(() => {
    if (!userScrolledUpRef.current) {
      animatedScrollToBottom(300);
    }
  }, [animatedScrollToBottom]);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isAtBottom = distanceFromBottom < 50; // Reduced threshold
    
    // Detect scroll direction with a minimum delta to avoid micro-scrolls
    const scrollDelta = scrollTop - lastScrollTopRef.current;
    const scrolledUp = scrollDelta < -5; // At least 5px up to count as intentional
    const scrolledDown = scrollDelta > 5;
    lastScrollTopRef.current = scrollTop;
    
    // If user scrolled up significantly and is not at bottom, lock the position
    if (scrolledUp && distanceFromBottom > 30) {
      userScrolledUpRef.current = true;
    }
    
    // Only reset when user actively scrolls DOWN to the bottom
    if (scrolledDown && isAtBottom) {
      userScrolledUpRef.current = false;
    }

    setShowScrollButton(distanceFromBottom > 200);

    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set user as scrolling
    setIsUserScrolling(true);

    // After scrolling stops, update state
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 200);
  }, []);

  // Auto-scroll on new messages (only if user hasn't intentionally scrolled up)
  useEffect(() => {
    // Don't auto-scroll if user has intentionally scrolled up
    if (userScrolledUpRef.current) {
      return;
    }
    
    if (!isUserScrolling && dependency) {
      // Use the conditional version that respects user's scroll position
      scrollToBottomIfNotScrolledUp();
    }
  }, [dependency, isUserScrolling, scrollToBottomIfNotScrolledUp]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    scrollRef,
    showScrollButton,
    scrollToBottom,
    scrollToBottomIfNotScrolledUp,
    handleScroll,
  };
};
