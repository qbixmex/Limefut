import { type RefObject, useEffect } from 'react';

export const useGrabScroll = (elementRef: RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let isGrabbing = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isGrabbing = true;
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
      element.classList.add('grabbing');
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isGrabbing) return;
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;

      // Multiply for greater sensitivity
      const walk = (x - startX) * 0.8;

      element.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      isGrabbing = false;
      element.classList.remove('grabbing');
    };

    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseUp);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [elementRef]);
};
