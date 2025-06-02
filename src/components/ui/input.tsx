import * as React from "react"

import { cn } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#e5e5e5] dark:border-[#333] bg-white dark:bg-[#1a1a1a] px-3 py-2 text-sm text-[#1a1a1a] dark:text-[#e5e5e5] placeholder:text-[#888] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] dark:focus-visible:ring-[#e5e5e5] focus-visible:ring-offset-0 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
