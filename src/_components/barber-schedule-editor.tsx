"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/_components/ui/dialog";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Badge } from "@/_components/ui/badge";
import {
  Clock,
  Plus,
  Trash2,
  Calendar,
  Coffee,
  Check,
  X,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/_components/ui/card";
import { Separator } from "@/_components/ui/separator";
import { Switch } from "@/_components/ui/switch";
import { Alert, AlertDescription } from "@/_components/ui/alert";
import { toast } from "sonner";

export interface WorkingHour {
  id?: string;
  weekday: number;
  startTime: string;
  endTime: string;
  pauses: Pause[];
}

export interface Pause {
  id?: string;
  startTime: string;
  endTime: string;
}

interface BarberScheduleEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workingHours: WorkingHour[];
  onChange: (hours: WorkingHour[]) => void;
  barberName?: string;
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

export default function BarberScheduleEditor({
  open,
  onOpenChange,
  workingHours,
  onChange,
  barberName = "barbeiro",
}: BarberScheduleEditorProps) {
  const [schedules, setSchedules] = useState<WorkingHour[]>(workingHours);
  const [editMode, setEditMode] = useState<"global" | "individual">("global");
  const [globalStartTime, setGlobalStartTime] = useState("09:00");
  const [globalEndTime, setGlobalEndTime] = useState("18:00");
  const [globalPauses, setGlobalPauses] = useState<Pause[]>([
    { startTime: "12:00", endTime: "13:00" },
  ]);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMountedRef.current) return;
    setSchedules(workingHours);
    if (workingHours.length > 0) {
      setSelectedDays(workingHours.map(wh => wh.weekday));
    }
  }, [workingHours, open]);

  // Quando mudar para modo individual e tiver dias selecionados sem schedules, criar schedules
  useEffect(() => {
    if (editMode === "individual" && selectedDays.length > 0 && open) {
      const missingDays = selectedDays.filter(
        day => !schedules.some(s => s.weekday === day)
      );
      if (missingDays.length > 0) {
        const newSchedules = [
          ...schedules,
          ...missingDays.map(weekday => ({
            weekday,
            startTime: globalStartTime,
            endTime: globalEndTime,
            pauses: globalPauses.map(p => ({ ...p })),
          })),
        ].sort((a, b) => a.weekday - b.weekday);
        setSchedules(newSchedules);
      }
    }
  }, [editMode, selectedDays, open]);

  const toggleDay = (weekday: number) => {
    if (selectedDays.includes(weekday)) {
      setSelectedDays(selectedDays.filter(d => d !== weekday));
    } else {
      setSelectedDays([...selectedDays, weekday].sort());
    }
  };

  const selectWeekdays = () => {
    setSelectedDays([1, 2, 3, 4, 5]);
  };

  const selectAll = () => {
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
  };

  const clearAll = () => {
    setSelectedDays([]);
  };

  const addGlobalPause = () => {
    setGlobalPauses([
      ...globalPauses,
      { startTime: "15:00", endTime: "15:30" },
    ]);
  };

  const removeGlobalPause = (index: number) => {
    setGlobalPauses(globalPauses.filter((_, i) => i !== index));
  };

  const updateGlobalPause = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setGlobalPauses(
      globalPauses.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const updateIndividualSchedule = (
    weekday: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const newSchedules = schedules.map(s =>
      s.weekday === weekday ? { ...s, [field]: value } : s
    );
    setSchedules(newSchedules);
  };

  const addIndividualPause = (weekday: number) => {
    const newSchedules = schedules.map(s =>
      s.weekday === weekday
        ? {
            ...s,
            pauses: [...s.pauses, { startTime: "15:00", endTime: "15:30" }],
          }
        : s
    );
    setSchedules(newSchedules);
  };

  const removeIndividualPause = (weekday: number, pauseIndex: number) => {
    const newSchedules = schedules.map(s =>
      s.weekday === weekday
        ? { ...s, pauses: s.pauses.filter((_, i) => i !== pauseIndex) }
        : s
    );
    setSchedules(newSchedules);
  };

  const updateIndividualPause = (
    weekday: number,
    pauseIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const newSchedules = schedules.map(s =>
      s.weekday === weekday
        ? {
            ...s,
            pauses: s.pauses.map((p, i) =>
              i === pauseIndex ? { ...p, [field]: value } : p
            ),
          }
        : s
    );
    setSchedules(newSchedules);
  };

  const handleSave = () => {
    if (selectedDays.length === 0) {
      toast.error("Por favor, selecione pelo menos um dia de trabalho");
      return;
    }

    if (editMode === "global") {
      const newSchedules: WorkingHour[] = selectedDays.map(weekday => ({
        weekday,
        startTime: globalStartTime,
        endTime: globalEndTime,
        pauses: globalPauses.map(p => ({ ...p })),
      }));
      setSchedules(newSchedules);
      onChange(newSchedules);
    } else {
      onChange(schedules);
    }

    onOpenChange(false);
  };

  const handleCancel = () => {
    setSchedules(workingHours);
    setSelectedDays(workingHours.map(wh => wh.weekday));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="h-6 w-6 text-primary" />
            Horários de Trabalho
          </DialogTitle>
          <DialogDescription>
            Configure os horários e pausas para <strong>{barberName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Toggle de Modo de Edição */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <Label className="text-base font-semibold">Modo de Edição</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {editMode === "global"
                  ? "Configure uma vez para todos os dias"
                  : "Configure cada dia individualmente"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={editMode === "global" ? "default" : "outline"}
                size="sm"
                onClick={() => setEditMode("global")}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Global
              </Button>
              <Button
                type="button"
                variant={editMode === "individual" ? "default" : "outline"}
                size="sm"
                onClick={() => setEditMode("individual")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Individual
              </Button>
            </div>
          </div>

          {/* Seleção de Dias */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Selecione os dias de trabalho
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectWeekdays}
                >
                  Seg-Sex
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAll}
                >
                  Todos
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                >
                  Limpar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekdays.map(day => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                    selectedDays.includes(day.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted"
                  }`}
                >
                  {selectedDays.includes(day.id) && (
                    <Check className="h-4 w-4 mb-1" />
                  )}
                  <span className="text-xs font-medium">{day.short}</span>
                </button>
              ))}
            </div>

            {selectedDays.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedDays.length} dia(s) selecionado(s):{" "}
                {selectedDays
                  .map(id => weekdays.find(w => w.id === id)?.short)
                  .join(", ")}
              </p>
            )}
          </div>

          <Separator />

          {/* Modo Global */}
          {editMode === "global" && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">
                  Horário de Trabalho Global
                </Label>
                <p className="text-sm text-muted-foreground">
                  Será aplicado para todos os dias selecionados
                </p>
              </div>

              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Início
                      </Label>
                      <Input
                        type="time"
                        value={globalStartTime}
                        onChange={e => setGlobalStartTime(e.target.value)}
                        className="text-lg font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Término
                      </Label>
                      <Input
                        type="time"
                        value={globalEndTime}
                        onChange={e => setGlobalEndTime(e.target.value)}
                        className="text-lg font-semibold"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Coffee className="h-4 w-4 text-primary" />
                        Pausas / Intervalos
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addGlobalPause}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>

                    {globalPauses.length > 0 ? (
                      <div className="space-y-2">
                        {globalPauses.map((pause, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-background rounded-lg border"
                          >
                            <Coffee className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <Input
                                type="time"
                                value={pause.startTime}
                                onChange={e =>
                                  updateGlobalPause(
                                    index,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                              />
                              <Input
                                type="time"
                                value={pause.endTime}
                                onChange={e =>
                                  updateGlobalPause(
                                    index,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeGlobalPause(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic p-3 text-center bg-muted/30 rounded-lg">
                        Sem pausas configuradas
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Modo Individual */}
          {editMode === "individual" && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">
                  Configuração Individual por Dia
                </Label>
                <p className="text-sm text-muted-foreground">
                  Configure cada dia de forma personalizada
                </p>
              </div>

              {schedules.length > 0 ? (
                <div className="space-y-3">
                  {schedules.map(schedule => {
                    const day = weekdays.find(w => w.id === schedule.weekday);
                    return (
                      <Card key={schedule.weekday} className="border-2">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">
                              {day?.name}
                            </Label>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Início</Label>
                              <Input
                                type="time"
                                value={schedule.startTime}
                                onChange={e =>
                                  updateIndividualSchedule(
                                    schedule.weekday,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Término</Label>
                              <Input
                                type="time"
                                value={schedule.endTime}
                                onChange={e =>
                                  updateIndividualSchedule(
                                    schedule.weekday,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs flex items-center gap-1">
                                <Coffee className="h-3 w-3" />
                                Pausas
                              </Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  addIndividualPause(schedule.weekday)
                                }
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Pausa
                              </Button>
                            </div>

                            {schedule.pauses.map((pause, pauseIndex) => (
                              <div
                                key={pauseIndex}
                                className="flex items-center gap-2 p-2 bg-muted/50 rounded"
                              >
                                <Input
                                  type="time"
                                  value={pause.startTime}
                                  onChange={e =>
                                    updateIndividualPause(
                                      schedule.weekday,
                                      pauseIndex,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  className="text-sm"
                                />
                                <Input
                                  type="time"
                                  value={pause.endTime}
                                  onChange={e =>
                                    updateIndividualPause(
                                      schedule.weekday,
                                      pauseIndex,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  className="text-sm"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeIndividualPause(
                                      schedule.weekday,
                                      pauseIndex
                                    )
                                  }
                                >
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Selecione os dias acima para configurar
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={selectedDays.length === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Salvar Horários
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
