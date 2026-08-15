import React from "react"

interface QrCornerFrameProps {
  children: React.ReactNode
  cornerSize?: string
  borderThickness?: string
  padding?: string
  className?: string
}

const CORNER_COLOR = "rgb(249 115 22 / 0.8)"

export function QrCornerFrame({
  children,
  cornerSize = "w-3 h-3",
  borderThickness = "1.5px",
  padding = "p-2",
  className = "",
}: QrCornerFrameProps) {
  return (
    <div
      className={`relative border border-white/5 bg-[#1c1d22]/95 shadow-lg ${padding} ${className}`}
    >
      <div
        className={`absolute -top-px -left-px ${cornerSize}`}
        style={{
          borderTopStyle: "solid",
          borderLeftStyle: "solid",
          borderTopWidth: borderThickness,
          borderLeftWidth: borderThickness,
          borderColor: CORNER_COLOR,
        }}
      />

      <div
        className={`absolute -top-px -right-px ${cornerSize}`}
        style={{
          borderTopStyle: "solid",
          borderRightStyle: "solid",
          borderTopWidth: borderThickness,
          borderRightWidth: borderThickness,
          borderColor: CORNER_COLOR,
        }}
      />

      <div
        className={`absolute -bottom-px -left-px ${cornerSize}`}
        style={{
          borderBottomStyle: "solid",
          borderLeftStyle: "solid",
          borderBottomWidth: borderThickness,
          borderLeftWidth: borderThickness,
          borderColor: CORNER_COLOR,
        }}
      />

      <div
        className={`absolute -right-px -bottom-px ${cornerSize}`}
        style={{
          borderBottomStyle: "solid",
          borderRightStyle: "solid",
          borderBottomWidth: borderThickness,
          borderRightWidth: borderThickness,
          borderColor: CORNER_COLOR,
        }}
      />

      {children}
    </div>
  )
}