declare module "react-slider" {
  import * as React from "react";

  export interface ReactSliderProps {
    className?: string;
    thumbClassName?: string;
    trackClassName?: string | ((index: number) => string);
    renderTrack?: (
      props: React.HTMLAttributes<HTMLDivElement>,
      state: { index: number }
    ) => React.ReactNode;
    renderThumb?: (
      props: React.HTMLAttributes<HTMLDivElement>,
      state: { index: number }
    ) => React.ReactNode;
    min?: number;
    max?: number;
    step?: number;
    value?: number | [number, number];
    onChange?: (value: any) => void;
    pearling?: boolean;
    minDistance?: number;
  }

  const ReactSlider: React.FC<ReactSliderProps>;

  export default ReactSlider;
}
