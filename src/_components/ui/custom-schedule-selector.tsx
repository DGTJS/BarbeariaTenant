"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/_components/ui/checkbox";
import { Label } from "@/_components/ui/label";
import { Input } from "@/_components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Clock, Plus, Trash2, Copy } from "lucide-react";

interface DaySchedule {
  id: number;
  name: string;
  short: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
}

interface CustomScheduleSelectorProps {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
  schedules: DaySchedule[];
  onSchedulesChange: (schedules: DaySchedule[]) => void;
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

export default function CustomScheduleSelector({ 
  selectedDays, 
  onDaysChange, 
  schedules,
  onSchedulesChange,
  className = "" 
}: CustomScheduleSelectorProps) {
  const [days, setDays] = useState<number[]>(selectedDays || []);
  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>(schedules || []);

  useEffect(() => {
    setDays(selectedDays || []);
  }, [selectedDays]);

  useEffect(() => {
    setDaySchedules(schedules || []);
  }, [schedules]);

  const handleDayToggle = (dayId: number) => {
    const newDays = days.includes(dayId)
      ? days.filter(d => d !== dayId)
      : [...days, dayId].sort();
    
    setDays(newDays);
    onDaysChange(newDays);

    // Se removendo o dia, remover o horário também
    if (!newDays.includes(dayId)) {
      const newSchedules = daySchedules.filter(s => s.id !== dayId);
      setDaySchedules(newSchedules);
      onSchedulesChange(newSchedules);
    } else {
      // Se adicionando o dia, criar horário padrão se não existir
      const existingSchedule = daySchedules.find(s => s.id === dayId);
      if (!existingSchedule) {
        const dayInfo = weekdays.find(w => w.id === dayId);
        const newSchedule: DaySchedule = {
          id: dayId,
          name: dayInfo?.name || "",
          short: dayInfo?.short || "",
          isOpen: true,
          startTime: "08:00",
          endTime: "18:00"
        };
        const newSchedules = [...daySchedules, newSchedule];
        setDaySchedules(newSchedules);
        onSchedulesChange(newSchedules);
      }
    }
  };

  const updateSchedule = (dayId: number, field: keyof DaySchedule, value: any) => {
    const newSchedules = daySchedules.map(schedule => 
      schedule.id === dayId 
        ? { ...schedule, [field]: value }
        : schedule
    );
    setDaySchedules(newSchedules);
    onSchedulesChange(newSchedules);
  };

  const selectAll = () => {
    const allDays = weekdays.map(w => w.id);
    setDays(allDays);
    onDaysChange(allDays);

    // Criar horários padrão para todos os dias
    const newSchedules = allDays.map(dayId => {
      const existing = daySchedules.find(s => s.id === dayId);
      if (existing) return existing;
      
      const dayInfo = weekdays.find(w => w.id === dayId);
      return {
        id: dayId,
        name: dayInfo?.name || "",
        short: dayInfo?.short || "",
        isOpen: true,
        startTime: "08:00",
        endTime: "18:00"
      };
    });
    setDaySchedules(newSchedules);
    onSchedulesChange(newSchedules);
  };

  const selectWeekdays = () => {
    const weekdaysOnly = weekdays.slice(1, 6).map(w => w.id);
    setDays(weekdaysOnly);
    onDaysChange(weekdaysOnly);

    // Criar horários padrão para dias úteis
    const newSchedules = weekdaysOnly.map(dayId => {
      const existing = daySchedules.find(s => s.id === dayId);
      if (existing) return existing;
      
      const dayInfo = weekdays.find(w => w.id === dayId);
      return {
        id: dayId,
        name: dayInfo?.name || "",
        short: dayInfo?.short || "",
        isOpen: true,
        startTime: "08:00",
        endTime: "18:00"
      };
    });
    setDaySchedules(newSchedules);
    onSchedulesChange(newSchedules);
  };

  const selectNone = () => {
    setDays([]);
    onDaysChange([]);
    setDaySchedules([]);
    onSchedulesChange([]);
  };

  const copySchedule = (fromDayId: number) => {
    const fromSchedule = daySchedules.find(s => s.id === fromDayId);
    if (!fromSchedule) return;

    const newSchedules = daySchedules.map(schedule => 
      days.includes(schedule.id) && schedule.id !== fromDayId
        ? { ...schedule, startTime: fromSchedule.startTime, endTime: fromSchedule.endTime }
        : schedule
    );
    setDaySchedules(newSchedules);
    onSchedulesChange(newSchedules);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Horários de Funcionamento</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-primary hover:underline"
          >
            Todos
          </button>
          <span className="text-xs text-muted-foreground">•</span>
          <button
            type="button"
            onClick={selectWeekdays}
            className="text-xs text-primary hover:underline"
          >
            Dias úteis
          </button>
          <span className="text-xs text-muted-foreground">•</span>
          <button
            type="button"
            onClick={selectNone}
            className="text-xs text-primary hover:underline"
          >
            Nenhum
          </button>
        </div>
      </div>

      {/* Seleção de dias */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
            {weekdays.map((weekday) => (
              <div key={weekday.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${weekday.id}`}
                  checked={days.includes(weekday.id)}
                  onCheckedChange={() => handleDayToggle(weekday.id)}
                />
                <Label
                  htmlFor={`day-${weekday.id}`}
                  className="text-sm font-medium cursor-pointer flex-1"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-xs text-muted-foreground">
                      {weekday.short}
                    </span>
                    <span className="text-xs">
                      {weekday.name.split('-')[0]}
                    </span>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Horários personalizados para cada dia */}
      {days.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Horários Personalizados</h3>
          {daySchedules
            .filter(schedule => days.includes(schedule.id))
            .sort((a, b) => a.id - b.id)
            .map((schedule) => (
              <Card key={schedule.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {schedule.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copySchedule(schedule.id)}
                        className="text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`open-${schedule.id}`}
                      checked={schedule.isOpen}
                      onCheckedChange={(checked) => 
                        updateSchedule(schedule.id, 'isOpen', checked)
                      }
                    />
                    <Label htmlFor={`open-${schedule.id}`} className="text-sm">
                      Aberto neste dia
                    </Label>
                  </div>

                  {schedule.isOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`start-${schedule.id}`} className="text-sm">
                          Horário de Abertura
                        </Label>
                        <Input
                          id={`start-${schedule.id}`}
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) => 
                            updateSchedule(schedule.id, 'startTime', e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`end-${schedule.id}`} className="text-sm">
                          Horário de Fechamento
                        </Label>
                        <Input
                          id={`end-${schedule.id}`}
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) => 
                            updateSchedule(schedule.id, 'endTime', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {days.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Dias selecionados:</span>{" "}
          {days.map(dayId => weekdays.find(w => w.id === dayId)?.name).join(", ")}
        </div>
      )}
    </div>
  );
}
