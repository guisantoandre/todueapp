import { Info } from "lucide-react";
import { ComponentProps, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentProps<"div"> & {
   text: string;
};

export function Tooltip({ children, text, className }: Props) {
   const [isVisible, setIsVisible] = useState(false);

   return (
      <div
         className="relative"
         onMouseEnter={() => setIsVisible(true)}
         onMouseLeave={() => setIsVisible(false)}
      >
         {children}
         {isVisible && (
            <div
               className={twMerge(
                  className,
                  "absolute right-0 top-0 grid grid-cols-[auto_1fr] gap-2 text-sm bg-black/80 text-white p-3 min-w-[200px] rounded z-10"
               )}
            >
               <Info className="w-4 h-4" />
               {text}
            </div>
         )}
      </div>
   );
}
