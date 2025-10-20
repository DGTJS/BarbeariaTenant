"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Droplets, Palette } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const predefinedColors = [
  // Cores primárias
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
  // Cores secundárias
  "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1",
  // Tons de cinza escuros
  "#1f2937", "#374151", "#4b5563", "#6b7280",
  // Tons de cinza claros
  "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af",
  // Cores especiais
  "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff"
];

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <div
          className="w-4 h-4 rounded border border-border"
          style={{ backgroundColor: value }}
        />
        <Palette className="h-4 w-4" />
        {label}
      </Button>

      {isOpen && (
        <div className="absolute top-10 left-0 z-50 bg-card border border-border rounded-lg p-4 shadow-lg min-w-[200px]">
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="h-4 w-4" />
            <span className="text-sm font-medium">Escolher Cor</span>
          </div>
          
          {/* Color picker nativo */}
          <div className="mb-3">
            <input
              type="color"
              value={value}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-full h-8 rounded border border-border cursor-pointer"
            />
          </div>

          {/* Cores predefinidas */}
          <div className="grid grid-cols-5 gap-2 mb-3">
            {predefinedColors.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}
          </div>

          {/* Valor atual */}
          <div className="text-xs text-foreground-muted text-center">
            {value}
          </div>
        </div>
      )}
    </div>
  );
}
