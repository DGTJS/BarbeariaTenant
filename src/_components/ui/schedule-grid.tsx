"use client";

import { useState } from "react";
import { Card, CardContent } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Settings,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface DaySchedule {
  id: number;
  name: string;
  short: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
}

interface ScheduleGridProps {
  selectedDays: number[];
  schedules: DaySchedule[];
  onScheduleUpdate?: (dayId: number, field: keyof DaySchedule, value: any) => void;
  onCopySchedule?: (fromDayId: number) => void;
  className?: string;
}

const weekdays = [
  { id: 0, name: "Domingo", short: "Dom" },
  { id: 1, name: "Segunda-feira", short: "Seg" },
  { id: 2, name: "Terça-feira", short: "Ter" },
  { id: 3, name: "Quarta-feira", short: "Qua" },
  { id: 4, name: "Quinta-feira", short: "Qui" },
  { id: 5, name: "Sexta-feira", short: "Sex" },
  { id: 6, name: "Sábado", short: "Sáb" },
];

export default function ScheduleGrid({ 
  selectedDays, 
  schedules, 
  onScheduleUpdate,
  onCopySchedule,
  className = "" 
}: ScheduleGridProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const getScheduleForDay = (dayId: number) => {
    return schedules.find(s => s.id === dayId) || {
      id: dayId,
      name: weekdays.find(w => w.id === dayId)?.name || "",
      short: weekdays.find(w => w.id === dayId)?.short || "",
      isOpen: true,
      startTime: "08:00",
      endTime: "18:00"
    };
  };

  const formatTime = (time: string) => {
    return time.replace(":", "h");
  };

  const getStatusColor = (isOpen: boolean) => {
    return isOpen ? "text-green-600" : "text-red-600";
  };

  const getStatusIcon = (isOpen: boolean) => {
    return isOpen ? (
      <CheckCircle className="h-3 w-3 text-green-600" />
    ) : (
      <XCircle className="h-3 w-3 text-red-600" />
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {weekdays
        .filter(day => selectedDays.includes(day.id))
        .map(day => {
          const schedule = getScheduleForDay(day.id);
          const isExpanded = expandedDay === day.id;

          return (
            <Card key={day.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(schedule.isOpen)}
                    <div>
                      <h3 className="font-medium text-sm">{day.name}</h3>
                      <p className={`text-xs ${getStatusColor(schedule.isOpen)}`}>
                        {schedule.isOpen 
                          ? `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`
                          : "Fechado"
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {onCopySchedule && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopySchedule(day.id)}
                        className="text-xs h-8"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                      className="text-xs h-8"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {isExpanded && onScheduleUpdate && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`open-${day.id}`}
                        checked={schedule.isOpen}
                        onChange={(e) => onScheduleUpdate(day.id, 'isOpen', e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor={`open-${day.id}`} className="text-sm">
                        Aberto neste dia
                      </label>
                    </div>

                    {schedule.isOpen && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor={`start-${day.id}`} className="text-xs text-muted-foreground block mb-1">
                            Horário de Abertura
                          </label>
                          <input
                            id={`start-${day.id}`}
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) => onScheduleUpdate(day.id, 'startTime', e.target.value)}
                            className="w-full px-2 py-1 text-sm border rounded"
                          />
                        </div>
                        <div>
                          <label htmlFor={`end-${day.id}`} className="text-xs text-muted-foreground block mb-1">
                            Horário de Fechamento
                          </label>
                          <input
                            id={`end-${day.id}`}
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) => onScheduleUpdate(day.id, 'endTime', e.target.value)}
                            className="w-full px-2 py-1 text-sm border rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
