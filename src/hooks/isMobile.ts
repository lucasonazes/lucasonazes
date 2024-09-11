"use client";

import { useCallback, useEffect, useState } from "react";

const useIsMobile = () => {
  const [width, setWidth] = useState(1000);
  const handleWindowSizeChange = useCallback(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    handleWindowSizeChange();
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [handleWindowSizeChange]);

  return width <= 768;
};

export default useIsMobile;
