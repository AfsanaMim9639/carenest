"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const GlassInput = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn("glass-input w-full", className)}
      {...props}
    />
  );
});

GlassInput.displayName = "GlassInput";

export default GlassInput;