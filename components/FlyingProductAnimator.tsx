
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface FlyingProductAnimatorProps {
  imageSrc: string;
  startRect: DOMRect;
  endRect: DOMRect;
  onAnimationEnd: () => void;
}

export const FlyingProductAnimator: React.FC<FlyingProductAnimatorProps> = ({
  imageSrc,
  startRect,
  endRect,
  onAnimationEnd,
}) => {
  const [style, setStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: startRect.top,
    left: startRect.left,
    width: startRect.width,
    height: startRect.height,
    opacity: 1,
    zIndex: 100,
    transition: 'all 600ms ease-in',
    borderRadius: '8px',
    overflow: 'hidden',
  });

  useEffect(() => {
    // We trigger the animation after the component has mounted
    // to ensure the transition is applied correctly.
    const animationTimeout = setTimeout(() => {
      setStyle((prevStyle) => ({
        ...prevStyle,
        top: endRect.top + endRect.height / 2,
        left: endRect.left + endRect.width / 2,
        width: 0,
        height: 0,
        opacity: 0,
        transform: 'rotate(20deg)',
      }));
    }, 10); // A small delay is enough

    // Clean up after the animation duration
    const endTimeout = setTimeout(() => {
      onAnimationEnd();
    }, 610); // A bit longer than the transition duration

    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(endTimeout);
    };
  }, [endRect, onAnimationEnd]);

  return createPortal(
    <div style={style}>
      <img
        src={imageSrc}
        alt="Animating product"
        className="w-full h-full object-cover"
      />
    </div>,
    document.body
  );
};
