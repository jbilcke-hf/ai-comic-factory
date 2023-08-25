"use client"

import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

export function ProgressBar ({
  className,
  progressPercentage,
  text
}: {
  className?: string
  progressPercentage?: number
  text?: string
}) {
  return (
    <div className={className}>
      <CircularProgressbar
        // doc: https://www.npmjs.com/package/react-circular-progressbar

        value={progressPercentage || 0}

        // Text to display inside progressbar. Default: ''.
        text={text || ""}   

        // Width of circular line relative to total width of component, a value from 0-100. Default: 8.
        strokeWidth={8}

        
          // As a convenience, you can use buildStyles to configure the most common style changes:

          styles={buildStyles({
            // Rotation of path and trail, in number of turns (0-1)
            rotation: 0,

            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: 'round',

            // Text size
            textSize: '20px',

            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 0.1,

            // Can specify path transition in more detail, or remove it entirely
            // pathTransition: 'none',

            // Colors
            // pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
            textColor: '#f88',
            trailColor: '#d6d6d6',
            backgroundColor: '#3e98c7',
          })}
      
      />
    </div>
  )
}