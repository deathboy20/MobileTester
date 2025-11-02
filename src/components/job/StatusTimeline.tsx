"use client"

import { Check, Clock, AlertTriangle, Play } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { JobStatus } from "@/lib/types"

const timelineSteps = [
  { status: "queued", icon: Clock, text: "Job Queued" },
  { status: "running", icon: Play, text: "Tests Running" },
  { status: "completed", icon: Check, text: "Tests Completed" },
]

const failedStep = { status: "failed", icon: AlertTriangle, text: "Tests Failed" };

type StatusTimelineProps = {
  status: JobStatus
}

export function StatusTimeline({ status }: StatusTimelineProps) {
  const activeIndex = timelineSteps.findIndex(s => s.status === status)
  
  const stepsToShow = status === 'failed' 
    ? [...timelineSteps.slice(0, activeIndex > -1 ? activeIndex : 1), failedStep] 
    : timelineSteps;
  
  const finalActiveIndex = status === 'failed' ? stepsToShow.length -1 : activeIndex;

  return (
    <div className="relative">
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border -z-10" />
      <ol>
        {stepsToShow.map((step, index) => {
          const isActive = index <= finalActiveIndex;
          const isCurrent = index === finalActiveIndex;
          
          const iconColor = 
            step.status === 'failed' ? "bg-destructive text-destructive-foreground" :
            isActive ? "bg-primary text-primary-foreground" :
            "bg-muted text-muted-foreground";

          return (
            <motion.li
              key={step.status}
              className="mb-6 ms-8 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <span className={cn(
                "absolute -left-0 flex items-center justify-center w-8 h-8 rounded-full ring-8 ring-background",
                iconColor
              )}>
                <step.icon className="w-4 h-4" />
              </span>
              <h3 className={cn("font-semibold", isCurrent && "text-primary")}>
                {step.text}
              </h3>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
