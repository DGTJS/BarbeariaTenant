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
  Edit,
  Save,
  X,
  Upload,
  User,
  Phone,
  Mail,
  Camera,
  Check,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";

interface Category {
  id: string;
  name: string;
  IconUrl: string;
}

interface Pause {
  id?: string;
  startTime: string;
  endTime: string;
}

interface WorkingHour {
  id?: string;
  weekday: number;
  startTime: string;
  endTime: string;
  pauses: Pause[];
}

interface Barber {
  id: string;
  name: string;
  phone: string | null;
  photo: string;
  categories: Category[];
  workingHours: WorkingHour[];
  user: {
    email: string;
    phone: string | null;
  };
}

interface BarberEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barber: Barber | null;
  categories: Category[];
  onSave: (barber: Barber) => Promise<void>;
}

export default function BarberEditModal({
  open,
  onOpenChange,
  barber,
  categories,
  onSave,
}: BarberEditModalProps) {
  const [editedBarber, setEditedBarber] = useState<Barber | null>(barber);
  const [saving, setSaving] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (open && barber && isMountedRef.current) {
      setEditedBarber(barber);
    }
  }, [open, barber]);

  if (!barber || !editedBarber) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(editedBarber);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar barbeiro:", error);
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const isSelected = editedBarber.categories.some(c => c.id === categoryId);

    if (isSelected) {
      setEditedBarber({
        ...editedBarber,
        categories: editedBarber.categories.filter(c => c.id !== categoryId),
      });
    } else {
      setEditedBarber({
        ...editedBarber,
        categories: [...editedBarber.categories, category],
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Edit className="h-6 w-6 text-primary" />
            Editar Barbeiro
          </DialogTitle>
          <DialogDescription>
            Edite as informações de <strong>{barber.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Foto do Barbeiro */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-primary/10">
              <AvatarImage src={editedBarber.photo} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-2xl">
                {editedBarber.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <Label className="text-sm font-semibold mb-2 block">
                Foto do Barbeiro
              </Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setEditedBarber({ ...editedBarber, photo: imageUrl });
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("photo-upload")?.click()
                  }
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Alterar Foto
                </Button>
              </div>
            </div>
          </div>

          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Nome
              </Label>
              <Input
                value={editedBarber.name}
                onChange={e =>
                  setEditedBarber({ ...editedBarber, name: e.target.value })
                }
                placeholder="Nome do barbeiro"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Telefone
              </Label>
              <Input
                value={editedBarber.phone || ""}
                onChange={e =>
                  setEditedBarber({ ...editedBarber, phone: e.target.value })
                }
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                E-mail
              </Label>
              <Input
                type="email"
                value={editedBarber.user.email}
                onChange={e =>
                  setEditedBarber({
                    ...editedBarber,
                    user: { ...editedBarber.user, email: e.target.value },
                  })
                }
                placeholder="barbeiro@email.com"
              />
            </div>
          </div>

          {/* Especialidades */}
          <div className="space-y-3">
            <div>
              <Label className="text-base font-semibold">Especialidades</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Selecione as especialidades do barbeiro
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map(category => {
                const isSelected = editedBarber.categories.some(
                  c => c.id === category.id
                );
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-border"
                      }`}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground mb-2">
                {editedBarber.categories.length} especialidade(s)
                selecionada(s):
              </p>
              <div className="flex flex-wrap gap-2">
                {editedBarber.categories.map(category => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="text-xs px-3 py-1 bg-primary/10 text-primary border-primary/20"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
