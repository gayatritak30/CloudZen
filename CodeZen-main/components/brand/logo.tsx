import { Code2 } from "lucide-react"
import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: "size-8", text: "text-base", padding: "p-1" },
    md: { icon: "size-10", text: "text-xl", padding: "p-1.5" },
    lg: { icon: "size-12", text: "text-3xl", padding: "p-2" },
  }

  const currentSize = sizes[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
     <Image src="/logo.png" alt="CodeZen" width={30} height={30} className={currentSize.icon} />
      {showText && (
        <span
          className={`${currentSize.text} font-bold tracking-tight bg-gradient-to-r from-black to-black/80 bg-clip-text text-transparent`}
        >
          CodeZen
        </span>
      )}
    </div>
  )
}
