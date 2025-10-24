"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/_components/ui/checkbox";
import { Label } from "@/_components/ui/label";
import { Input } from "@/_components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { Badge } from "@/_components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_components/ui/tabs";
import { 
  Clock, 
  Plus, 
  Trash2, 
  Copy, 
  ChevronDown, 
  ChevronUp,
  Settings,
  Eye,
  EyeOff,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";

interface DaySchedule {
  id: number;
  name: string;
  short: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
}

interface ImprovedScheduleSelectorProps {
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

export default function ImprovedScheduleSelector({ 
  selectedDays, 
  onDaysChange, 
  schedules,
  onSchedulesChange,
  className = "" 
}: ImprovedScheduleSelectorProps) {
  const [days, setDays] = useState<number[]>(selectedDays || []);
  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>(schedules || []);
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('selection');

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

    if (!newDays.includes(dayId)) {
      const newSchedules = daySchedules.filter(s => s.id !== dayId);
      setDaySchedules(newSchedules);
      onSchedulesChange(newSchedules);
    } else {
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

  const toggleDayExpansion = (dayId: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayId)) {
      newExpanded.delete(dayId);
    } else {
      newExpanded.add(dayId);
    }
    setExpandedDays(newExpanded);
  };

  const getScheduleSummary = () => {
    const openDays = daySchedules.filter(s => s.isOpen && days.includes(s.id));
    const closedDays = daySchedules.filter(s => !s.isOpen && days.includes(s.id));
    
    return {
      total: days.length,
      open: openDays.length,
      closed: closedDays.length,
      hasVariedHours: openDays.some(s => s.startTime !== "08:00" || s.endTime !== "18:00")
    };
  };

  const summary = getScheduleSummary();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header com resumo */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-medium">Horários de Funcionamento</Label>
          {days.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
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
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'compact' ? 'detailed' : 'compact')}
            className="text-xs"
          >
            {viewMode === 'compact' ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
            {viewMode === 'compact' ? 'Detalhado' : 'Compacto'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="selection" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Seleção
          </TabsTrigger>
          <TabsTrigger value="schedules" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horários
          </TabsTrigger>
        </TabsList>

        {/* Aba de Seleção de Dias */}
        <TabsContent value="selection" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Dias de Funcionamento</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAll}
                    className="text-xs"
                  >
                    Todos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectWeekdays}
                    className="text-xs"
                  >
                    Dias úteis
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectNone}
                    className="text-xs"
                  >
                    Nenhum
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
        </TabsContent>

        {/* Aba de Horários */}
        <TabsContent value="schedules" className="space-y-4">
          {days.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum dia selecionado</h3>
                <p className="text-muted-foreground mb-4">
                  Selecione os dias de funcionamento na aba "Seleção" para configurar os horários.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('selection')}
                >
                  Selecionar Dias
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {daySchedules
                .filter(schedule => days.includes(schedule.id))
                .sort((a, b) => a.id - b.id)
                .map((schedule) => (
                  <Card key={schedule.id} className="overflow-hidden">
                    <CardHeader 
                      className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleDayExpansion(schedule.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {schedule.isOpen ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">{schedule.name}</span>
                          </div>
                          {schedule.isOpen && (
                            <Badge variant="outline" className="text-xs">
                              {schedule.startTime} - {schedule.endTime}
                            </Badge>
                          )}
                          {!schedule.isOpen && (
                            <Badge variant="outline" className="text-xs text-red-600">
                              Fechado
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copySchedule(schedule.id);
                            }}
                            className="text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copiar
                          </Button>
                          {expandedDays.has(schedule.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedDays.has(schedule.id) && (
                      <CardContent className="pt-0">
                        <div className="space-y-4">
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
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
