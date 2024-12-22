"use client"

import { useState } from "react"
import { Check, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language: string
  className?: string
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative rounded-md bg-[#1e1e1e] overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d]">
        <span className="text-sm text-[#a9b1d6]">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-[#a9b1d6] hover:text-[#c0caf5] hover:bg-[#3a3f58]"
          onClick={copyToClipboard}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy code
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-[#a9b1d6] text-sm">{code}</code>
      </pre>
    </div>
  )
}

