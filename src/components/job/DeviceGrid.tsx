"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import type { JobStatus } from "@/lib/types"

type DeviceGridProps = {
  devices: { name: string; status: JobStatus }[]
}

const statusColors: Record<JobStatus, string> = {
  queued: "bg-gray-500",
  running: "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
};

const screenshots = [
  PlaceHolderImages.find(img => img.id === "device-screenshot-1")!,
  PlaceHolderImages.find(img => img.id === "device-screenshot-2")!,
  PlaceHolderImages.find(img => img.id === "device-screenshot-3")!,
  PlaceHolderImages.find(img => img.id === "device-screenshot-4")!,
  PlaceHolderImages.find(img => img.id === "device-screenshot-5")!,
]

export function DeviceGrid({ devices }: DeviceGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {devices.map((device, index) => {
        const screenshot = screenshots[index % screenshots.length];
        return (
          <motion.div
            key={device.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="overflow-hidden group relative h-64 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Image
                  src={screenshot.imageUrl}
                  alt={`Screenshot on ${device.name}`}
                  width={400}
                  height={800}
                  data-ai-hint={screenshot.imageHint}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3 w-full">
                  <h3 className="text-sm font-semibold text-white truncate">{device.name}</h3>
                   <Badge className={`mt-1 capitalize text-white text-xs ${statusColors[device.status]}`}>{device.status}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
