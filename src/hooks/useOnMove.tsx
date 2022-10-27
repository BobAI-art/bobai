import { useEffect, useRef } from "react";

export const useOnMove = (
  callback: (dx: number, dy: number) => void,
  active: boolean
) => {
  const previousTouch = useRef<Touch | undefined>(undefined);

  useEffect(() => {
    if (!active) {
      previousTouch.current = undefined;
      return;
    }
    const moveHandler = (e: MouseEvent) => {
      callback(e.movementX, e.movementY);
    };
    const touchMoveHandler = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (previousTouch.current && touch) {
        callback(
          touch.clientX - previousTouch.current.clientX,
          touch.clientY - previousTouch.current.clientY
        );
      }
      previousTouch.current = e.touches[0];
    };
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("touchmove", touchMoveHandler, {
      passive: false,
    });
    return () => {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("touchmove", touchMoveHandler);
    };
  }, [active, callback, previousTouch]);
};
