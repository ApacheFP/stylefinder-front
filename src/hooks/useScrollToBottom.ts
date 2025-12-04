import { useState, useEffect, useRef, useCallback } from 'react';

// Easing function for smooth animation (easeOutCubic)
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const useScrollToBottom = (dependency: unknown) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
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
