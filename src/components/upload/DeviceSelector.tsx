"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TOP_20_DEVICES, getDeviceById } from "@/constants/devices";
import { useDeviceSelector } from "@/hooks/useDeviceSelector";

export function DeviceSelector() {
  const [open, setOpen] = React.useState(false);
  const { devices, selectedDevices, toggleDevice, setSelectedDevices } =
    useDeviceSelector(5); // Limit to 5 for free tier as per prompt

  const handleUnselect = (e: React.MouseEvent, device: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDevice(device);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10"
          >
            <div className="flex flex-wrap gap-1">
              {selectedDevices.length > 0 ? (
                selectedDevices.map((device) => (
                  <Badge
                    key={device}
                    variant="secondary"
                    className="rounded-sm"
                  >
                    {device}
                    <button
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={(e) => handleUnselect(e, device)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">Select devices...</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search devices..." />
            <CommandList>
              <CommandEmpty>No device found.</CommandEmpty>
              <CommandGroup>
                {devices.map((device) => (
                  <CommandItem
                    key={device}
                    value={device}
                    onSelect={() => {
                      toggleDevice(device);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedDevices.includes(device)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {device}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-muted-foreground">
        Select up to 5 devices for testing (Free Tier Limit).
      </p>
    </div>
  );
}
