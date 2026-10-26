import { ReactNode, useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
}

/**
 * Heavy motion graphic wrapper that makes text slowly fade in and reveal itself
 * between scrolls, mimicking CRT phosphor illumination and raster scan discovery.
 * Uses native IntersectionObserver for flawless React 19 compatibility.
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0.05,
  direction = 'up',
  duration = 0.85,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger reveal when scrolling into view
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Allows re-revealing when scrolling between sections if desired
          setIsVisible(false);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 28px, 0)';
      case 'down':
        return 'translate3d(0, -28px, 0)';
      case 'left':
        return 'translate3d(28px, 0, 0)';
      case 'right':
        return 'translate3d(-28px, 0, 0)';
      case 'none':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={elementRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        filter: isVisible ? 'blur(0px)' : 'blur(4px)',
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'opacity, transform, filter',
      }}
      className={`relative ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Character-by-character or word-by-word reveal for high-impact headlines
 */
export function ScrollRevealHeading({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block mr-[0.25em]"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            filter: isVisible ? 'blur(0px)' : 'blur(4px)',
            transition: `opacity 0.65s cubic-bezier(0.2, 1, 0.3, 1) ${
              delay + i * 0.06
            }s, transform 0.65s cubic-bezier(0.2, 1, 0.3, 1) ${
              delay + i * 0.06
            }s, filter 0.65s cubic-bezier(0.2, 1, 0.3, 1) ${delay + i * 0.06}s`,
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
