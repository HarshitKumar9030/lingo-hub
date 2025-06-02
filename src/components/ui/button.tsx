import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-[#1a1a1a] hover:bg-[#333] dark:bg-[#e5e5e5] dark:hover:bg-[#d0d0d0] text-white dark:text-[#1a1a1a] shadow-sm hover:shadow-md border-0 rounded-lg",
        destructive:
          "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white shadow-sm hover:shadow-md border-0 rounded-lg",
        outline:
          "border border-[#e5e5e5] dark:border-[#333] bg-white dark:bg-[#1a1a1a] hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a] text-[#1a1a1a] dark:text-[#e5e5e5] rounded-lg",
        secondary:
          "bg-[#f5f5f5] dark:bg-[#2a2a2a] hover:bg-[#e5e5e5] dark:hover:bg-[#333] text-[#1a1a1a] dark:text-[#e5e5e5] rounded-lg border border-[#e5e5e5] dark:border-[#333]",
        ghost:
          "hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a] text-[#1a1a1a] dark:text-[#e5e5e5] rounded-lg transition-colors",
        link: "text-[#1a1a1a] dark:text-[#e5e5e5] underline-offset-4 hover:underline font-medium",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 py-1.5 text-xs rounded-md",
        lg: "h-11 px-6 py-2.5 text-sm",
        xl: "h-12 px-8 py-3 text-base",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
