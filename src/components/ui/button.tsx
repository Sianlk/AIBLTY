import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: `
          bg-gradient-to-b from-primary via-primary to-primary/90 
          text-primary-foreground font-bold
          shadow-[0_1px_0_0_hsl(var(--champagne)/0.5)_inset,0_-1px_0_0_hsl(var(--gold-dark)/0.8)_inset,0_4px_12px_hsl(var(--gold-dark)/0.4)]
          hover:shadow-[0_1px_0_0_hsl(var(--champagne)/0.6)_inset,0_-1px_0_0_hsl(var(--gold-dark)/0.9)_inset,0_8px_20px_hsl(var(--gold-dark)/0.5)]
          hover:translate-y-[-1px]
          active:translate-y-[1px]
        `,
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/25",
        outline: `
          border-2 border-gold/40 bg-transparent text-champagne font-semibold
          shadow-[0_0_20px_hsl(var(--gold)/0.1)]
          hover:border-gold/70 hover:bg-gold/10 hover:text-champagne
          hover:shadow-[0_0_30px_hsl(var(--gold)/0.2)]
        `,
        secondary: `
          bg-gradient-to-b from-gold-muted via-gold-dark to-gold-deep 
          text-champagne font-bold
          shadow-[0_1px_0_0_hsl(var(--gold-muted)/0.4)_inset,0_-1px_0_0_hsl(var(--gold-deep)/0.8)_inset,0_4px_12px_hsl(var(--gold-deep)/0.4)]
          hover:shadow-[0_1px_0_0_hsl(var(--gold)/0.5)_inset,0_-1px_0_0_hsl(var(--gold-deep)/0.9)_inset,0_8px_20px_hsl(var(--gold-deep)/0.5)]
          hover:translate-y-[-1px]
        `,
        ghost: "hover:bg-gold/10 hover:text-champagne",
        link: "text-gold underline-offset-4 hover:underline hover:text-gold-light",
        glow: `
          bg-gradient-to-b from-gold-light via-gold to-gold-dark
          text-background font-bold tracking-wide
          shadow-[0_2px_0_0_hsl(var(--champagne)/0.7)_inset,0_-2px_0_0_hsl(var(--gold-dark)/0.9)_inset,0_6px_20px_hsl(var(--gold-dark)/0.5),0_0_40px_hsl(var(--gold)/0.2)]
          hover:shadow-[0_2px_0_0_hsl(var(--champagne)/0.8)_inset,0_-2px_0_0_hsl(var(--gold)/0.9)_inset,0_10px_30px_hsl(var(--gold-dark)/0.6),0_0_60px_hsl(var(--gold)/0.3)]
          hover:translate-y-[-2px]
          active:translate-y-[1px]
        `,
        glass: `
          bg-card/60 backdrop-blur-2xl 
          border border-gold/30 text-champagne font-semibold
          shadow-[0_1px_0_0_hsl(var(--gold)/0.1)_inset,0_-1px_0_0_hsl(var(--obsidian)/0.5)_inset,0_4px_16px_hsl(var(--obsidian)/0.4)]
          hover:border-gold/50 hover:bg-card/80
          hover:shadow-[0_1px_0_0_hsl(var(--gold)/0.15)_inset,0_-1px_0_0_hsl(var(--obsidian)/0.6)_inset,0_8px_24px_hsl(var(--obsidian)/0.5),0_0_40px_hsl(var(--gold)/0.1)]
        `,
        hero: `
          bg-gradient-to-r from-gold-light via-gold to-gold-dark
          text-background font-bold tracking-wide
          shadow-[0_2px_0_0_hsl(var(--champagne)/0.8)_inset,0_-2px_0_0_hsl(var(--gold-deep)/0.9)_inset,0_8px_32px_hsl(var(--gold-dark)/0.5),0_0_60px_hsl(var(--gold)/0.25)]
          hover:shadow-[0_2px_0_0_hsl(45_50%_92%/0.9)_inset,0_-2px_0_0_hsl(var(--gold)/0.9)_inset,0_12px_48px_hsl(var(--gold-dark)/0.6),0_0_80px_hsl(var(--gold)/0.35)]
          hover:scale-[1.02] hover:translate-y-[-2px]
          active:scale-[0.98]
        `,
        premium: `
          relative overflow-hidden
          bg-gradient-to-b from-gold-light via-gold-bright to-gold
          text-background font-bold tracking-wider uppercase
          shadow-[0_2px_0_0_hsl(var(--champagne)/0.9)_inset,0_-3px_0_0_hsl(var(--gold-dark)/0.95)_inset,0_10px_40px_hsl(var(--gold-dark)/0.6),0_0_80px_hsl(var(--gold)/0.3)]
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-200%] before:animate-shimmer
          hover:shadow-[0_2px_0_0_hsl(45_50%_95%/1)_inset,0_-3px_0_0_hsl(var(--gold)/0.95)_inset,0_15px_50px_hsl(var(--gold-dark)/0.7),0_0_100px_hsl(var(--gold)/0.4)]
          hover:translate-y-[-3px]
        `,
        elite: `
          bg-gradient-to-r from-gold-bright via-gold-light to-champagne
          text-background font-bold tracking-wide
          shadow-[0_2px_0_0_hsl(42_50%_90%/0.7)_inset,0_-2px_0_0_hsl(var(--gold)/0.9)_inset,0_8px_32px_hsl(var(--gold-dark)/0.5),0_0_60px_hsl(var(--gold-light)/0.25)]
          hover:shadow-[0_2px_0_0_hsl(42_50%_95%/0.8)_inset,0_-2px_0_0_hsl(var(--gold-bright)/0.9)_inset,0_12px_48px_hsl(var(--gold-dark)/0.6),0_0_80px_hsl(var(--gold-light)/0.35)]
          hover:translate-y-[-2px]
        `,
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-xl px-10 text-base",
        xl: "h-16 rounded-2xl px-12 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
