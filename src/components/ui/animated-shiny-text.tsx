import { CSSProperties, FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}

const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 200,
}) => {
  return (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          "inline-flex items-center justify-center px-4 py-1",
          "text-[#a9b1d6] hover:text-[#c0caf5]",
          "transition ease-out duration-300",
          "relative z-10",
          "text-transparent bg-clip-text bg-gradient-to-r",
          "from-[#7aa2f7] via-[#c0caf5] to-[#7aa2f7]",
          "animate-shine-infinite",
          className
        )}
        style={{
          backgroundSize: `${shimmerWidth}% 100%`,
          backgroundRepeat: 'no-repeat',
        } as CSSProperties}
      >
        <span>{children}</span>
      </div>
    </div>
  );
};

export default AnimatedShinyText;

