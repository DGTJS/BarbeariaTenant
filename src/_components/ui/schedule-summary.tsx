"use client";

import { Badge } from "@/_components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Clock, Calendar, CheckCircle, XCircle, Settings } from "lucide-react";

interface DaySchedule {
  id: number;
  name: string;
  short: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
}

interface ScheduleSummaryProps {
  selectedDays: number[];
  schedules: DaySchedule[];
  onEditClick?: () => void;
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

export default function ScheduleSummary({ 
  selectedDays, 
  schedules, 
  onEditClick,
  className = "" 
}: ScheduleSummaryProps) {
  const getScheduleSummary = () => {
    const openDays = schedules.filter(s => s.isOpen && selectedDays.includes(s.id));
    const closedDays = schedules.filter(s => !s.isOpen && selectedDays.includes(s.id));
    
    // Verificar se todos os horários são iguais
    const openSchedules = schedules.filter(s => s.isOpen && selectedDays.includes(s.id));
    const hasVariedHours = openSchedules.length > 0 && 
      openSchedules.some(s => s.startTime !== openSchedules[0].startTime || s.endTime !== openSchedules[0].endTime);
    
    return {
      total: selectedDays.length,
      open: openDays.length,
      closed: closedDays.length,
      hasVariedHours,
      commonHours: openSchedules.length > 0 ? {
        start: openSchedules[0].startTime,
        end: openSchedules[0].endTime
      } : null
    };
  };

  const summary = getScheduleSummary();

  if (selectedDays.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhum dia de funcionamento configurado
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Resumo dos Horários
          </CardTitle>
          {onEditClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditClick}
              className="text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {summary.total} dias selecionados
          </Badge>
          <Badge variant="outline" className="text-xs text-green-600">
            {summary.open} abertos
          </Badge>
          {summary.closed > 0 && (
            <Badge variant="outline" className="text-xs text-red-600">
              {summary.closed} fechados
            </Badge>
          )}
          {summary.hasVariedHours && (
            <Badge variant="outline" className="text-xs text-blue-600">
              Horários variados
            </Badge>
          )}
        </div>

        {/* Horários comuns */}
        {!summary.hasVariedHours && summary.commonHours && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm font-medium mb-1">Horário padrão:</p>
            <p className="text-sm text-muted-foreground">
              {summary.commonHours.start} - {summary.commonHours.end}
            </p>
          </div>
        )}

        {/* Lista compacta dos dias */}
        <div className="space-y-2">
          {weekdays
            .filter(day => selectedDays.includes(day.id))
            .map(day => {
              const schedule = schedules.find(s => s.id === day.id);
              const isOpen = schedule?.isOpen ?? true;
              const startTime = schedule?.startTime ?? "08:00";
              const endTime = schedule?.endTime ?? "18:00";

              return (
                <div key={day.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {isOpen ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-600" />
                    )}
                    <span className="font-medium">{day.short}</span>
                  </div>
                  <span className={isOpen ? "text-green-600" : "text-red-600"}>
                    {isOpen ? `${startTime} - ${endTime}` : "Fechado"}
                  </span>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
