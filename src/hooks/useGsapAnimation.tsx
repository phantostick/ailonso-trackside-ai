import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useGsapHover = () => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.05,
        boxShadow: '0 0 20px rgba(10, 185, 139, 0.5)',
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        boxShadow: '0 0 0px rgba(10, 185, 139, 0)',
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleClick = () => {
      gsap.fromTo(element,
        { scale: 0.95 },
        { scale: 1.05, duration: 0.2, ease: 'back.out(1.7)' }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('click', handleClick);
    };
  }, []);

  return elementRef;
};
