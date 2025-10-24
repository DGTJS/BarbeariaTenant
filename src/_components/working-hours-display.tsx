"use client";

import { useSiteConfig } from "@/_hooks/useSiteConfig";
import { Clock } from "lucide-react";

const weekdays = [
  { id: 0, name: "Domingo", short: "Dom" },
  { id: 1, name: "Segunda-feira", short: "Seg" },
  { id: 2, name: "Terça-feira", short: "Ter" },
  { id: 3, name: "Quarta-feira", short: "Qua" },
  { id: 4, name: "Quinta-feira", short: "Qui" },
  { id: 5, name: "Sexta-feira", short: "Sex" },
  { id: 6, name: "Sábado", short: "Sáb" },
];

interface WorkingHoursDisplayProps {
  className?: string;
}

export default function WorkingHoursDisplay({ className = "" }: WorkingHoursDisplayProps) {
  const { config, loading } = useSiteConfig();

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const workingDays = config.working_days || [];
  const customSchedules = config.custom_schedules || [];
  const defaultStart = config.working_hours_start || "08:00";
  const defaultEnd = config.working_hours_end || "18:00";

  if (workingDays.length === 0) {
    return (
      <div className={`text-muted-foreground ${className}`}>
        <Clock className="h-4 w-4 inline mr-2" />
        Horários não configurados
      </div>
    );
  }

  const formatTime = (time: string) => {
    return time.replace(":", "h");
  };

  const getDaySchedule = (dayId: number) => {
    const customSchedule = customSchedules.find(s => s.id === dayId);
    if (customSchedule) {
      return {
        isOpen: customSchedule.isOpen,
        startTime: customSchedule.startTime,
        endTime: customSchedule.endTime
      };
    }
    return {
      isOpen: true,
      startTime: defaultStart,
      endTime: defaultEnd
    };
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <Clock className="h-4 w-4" />
        Horários de Funcionamento
      </div>
      
      <div className="space-y-1">
        {weekdays
          .filter(day => workingDays.includes(day.id))
          .map(day => {
            const schedule = getDaySchedule(day.id);
            return (
              <div key={day.id} className="flex justify-between items-center text-sm">
                <span className="font-medium">{day.name}</span>
                <span className={schedule.isOpen ? "text-green-600" : "text-red-600"}>
                  {schedule.isOpen 
                    ? `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`
                    : "Fechado"
                  }
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
