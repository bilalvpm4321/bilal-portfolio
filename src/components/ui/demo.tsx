import React from "react"
import { LiquidButton, MetalButton } from "@/components/ui/liquid-glass-button"

export default function DemoOne() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="relative h-[120px] w-full max-w-[400px] flex items-center justify-center">
        <LiquidButton className="text-white dark:text-white font-semibold">
          Liquid Glass
        </LiquidButton>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <MetalButton variant="default">Get Started</MetalButton>
        <MetalButton variant="gold">Gold Metal</MetalButton>
        <MetalButton variant="primary">Primary</MetalButton>
      </div>
    </div>
  )
}
export { DemoOne }
