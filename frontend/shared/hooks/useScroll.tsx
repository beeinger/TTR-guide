import { useCallback, useEffect, useRef, useState } from "react";

export default function useScroll() {
  const ref = useRef(null);
  const scroll = useCallback(
    (scrollAmount) => () => {
      if (!ref.current) return;
      ref.current.scrollLeft += scrollAmount;
    },
    [ref.current]
  );

  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);

  const updateVisibilityOfArrows = useCallback(() => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    if (scrollLeft > 50) setLeftVisible(true);
    else setLeftVisible(false);
    if (scrollLeft + clientWidth + 50 < scrollWidth) setRightVisible(true);
    else setRightVisible(false);
  }, [ref.current]);

  useEffect(() => {
    if (!ref.current) return;
    updateVisibilityOfArrows();
  }, [ref.current]);

  return { scroll, leftVisible, rightVisible, ref, updateVisibilityOfArrows };
}
