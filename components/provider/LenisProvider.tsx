"use client";
import { PropsWithChildren } from "react";
import { ReactLenis } from "lenis/react";

const LenisProvider = ({ children }: PropsWithChildren) => {
  return (
    <ReactLenis
      options={{
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 5),
        smoothWheel: true,
      }}
      root={true}
    >
      {children}
    </ReactLenis>
  );
};

export default LenisProvider;



