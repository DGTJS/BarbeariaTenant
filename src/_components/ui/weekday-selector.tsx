"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/_components/ui/checkbox";
import { Label } from "@/_components/ui/label";
import { Card, CardContent } from "@/_components/ui/card";

interface WeekdaySelectorProps {
  selectedDays: number[] | undefined;
  onDaysChange: (days: number[]) => void;
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

export default function WeekdaySelector({ 
  selectedDays, 
  onDaysChange, 
  className = "" 
}: WeekdaySelectorProps) {
  const [days, setDays] = useState<number[]>(selectedDays || []);

  useEffect(() => {
    setDays(selectedDays || []);
  }, [selectedDays]);

  const handleDayToggle = (dayId: number) => {
    const newDays = days.includes(dayId)
      ? days.filter(d => d !== dayId)
      : [...days, dayId].sort();
    
    setDays(newDays);
    onDaysChange(newDays);
  };

  const selectAll = () => {
    const allDays = weekdays.map(w => w.id);
    setDays(allDays);
    onDaysChange(allDays);
  };

  const selectNone = () => {
    setDays([]);
    onDaysChange([]);
  };

  const selectWeekdays = () => {
    const weekdaysOnly = weekdays.slice(1, 6).map(w => w.id);
    setDays(weekdaysOnly);
    onDaysChange(weekdaysOnly);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Dias de Funcionamento</Label>
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

      {days.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Dias selecionados:</span>{" "}
          {days.map(dayId => weekdays.find(w => w.id === dayId)?.name).join(", ")}
        </div>
      )}
    </div>
  );
}
