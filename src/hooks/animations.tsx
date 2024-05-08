import { RefObject, useEffect, useState } from 'react';

type AnimationName = 'fade';

interface Animation {
  enter: Keyframe[];
  exit: Keyframe[];
}

// add animation here
const animations: Record<AnimationName, Animation> = {
  fade: {
    enter: [{ opacity: 0 }, { opacity: 1 }],
    exit: [{ opacity: 1 }, { opacity: 0 }],
  },
};

export const useAnimation = (
  ref: RefObject<HTMLElement>,
  animation: AnimationName,
  defaultShown = false,
  options: KeyframeAnimationOptions = { duration: 300 },
) => {
  const [isShown, setIsShown] = useState(defaultShown);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (transitioning) {
      setIsShown(true);

      if (!element) return;

      element.animate(animations[animation].enter, { ...options, fill: 'forwards' });
    }

    if (!transitioning) {
      if (!element) return;

      const anim = element.animate(animations[animation].exit, { ...options, fill: 'forwards' });

      anim.onfinish = () => {
        setIsShown(false);
      };
    }
  }, [transitioning, isShown]);

  const toggleShow = () => {
    setTransitioning(!transitioning);
  };

  const startTransitionTo = (to: boolean) => {
    setTransitioning(to);
  };

  return {
    isShown,
    toggleShow,
    startTransitionTo,
  };
};
