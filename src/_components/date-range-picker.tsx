"use client";

import * as React from "react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { cn } from "@/_lib/utils";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDates, setSelectedDates] =
    React.useState<DateRange>(dateRange);

  React.useEffect(() => {
    setSelectedDates(dateRange);
  }, [dateRange]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleared = { from: undefined, to: undefined };
    setSelectedDates(cleared);
    onDateRangeChange(cleared);
  };

  const handleApply = () => {
    onDateRangeChange(selectedDates);
    setIsOpen(false);
  };

  const displayText = React.useMemo(() => {
    if (!selectedDates.from && !selectedDates.to) {
      return "Selecione um período";
    }
    if (selectedDates.from && selectedDates.to) {
      return `${format(selectedDates.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(selectedDates.to, "dd/MM/yyyy", { locale: ptBR })}`;
    }
    if (selectedDates.from) {
      return `A partir de ${format(selectedDates.from, "dd/MM/yyyy", { locale: ptBR })}`;
    }
    return "Selecione um período";
  }, [selectedDates]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDates.from && !selectedDates.to && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText}
          {(selectedDates.from || selectedDates.to) && (
            <X
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
              onClick={e => {
                e.stopPropagation();
                handleClear(e);
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Selecione o período</h4>
            <p className="text-xs text-muted-foreground">
              {selectedDates.from && !selectedDates.to
                ? "Clique no último dia do período"
                : "Clique no primeiro dia e depois no último dia"}
            </p>
          </div>
          <Calendar
            mode="range"
            selected={{
              from: selectedDates.from,
              to: selectedDates.to,
            }}
            onSelect={(
              range:
                | { from: Date | undefined; to: Date | undefined }
                | undefined
            ) => {
              if (range) {
                setSelectedDates({
                  from: range.from,
                  to: range.to,
                });
                // Se range completo, aplicar automaticamente
                if (range.from && range.to) {
                  setTimeout(() => {
                    onDateRangeChange({
                      from: range.from,
                      to: range.to,
                    });
                    setIsOpen(false);
                  }, 300);
                }
              }
            }}
            locale={ptBR}
            className="rounded-md border"
            numberOfMonths={1}
            classNames={{
              day_range_start:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-l-md",
              day_range_end:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-r-md",
              day_in_range: "bg-primary/20 text-primary font-medium",
            }}
          />
          {selectedDates.from && selectedDates.to && (
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="text-sm">
                <span className="font-medium">Período selecionado:</span>
                <div className="text-muted-foreground mt-1">
                  {format(selectedDates.from, "dd/MM/yyyy", { locale: ptBR })}{" "}
                  até {format(selectedDates.to, "dd/MM/yyyy", { locale: ptBR })}
                </div>
              </div>
              <Button size="sm" onClick={handleApply}>
                Aplicar
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
