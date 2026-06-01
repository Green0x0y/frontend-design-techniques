import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export interface VacuumSchedule {
  id: number;
  title: string;
  rooms: string;
}

interface VacuumScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: VacuumSchedule | null;
  onSave: (updatedSchedule: VacuumSchedule) => void;
}

const DAYS = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela",
];

const ROOMS = ["Salon", "Kuchnia", "Sypialnia", "Łazienka"];

export function VacuumScheduleDialog({
  open,
  onOpenChange,
  schedule,
  onSave,
}: VacuumScheduleDialogProps) {
  const [title, setTitle] = useState("");
  const [rooms, setRooms] = useState("");

  const [time, setTime] = useState("10:00");

  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
  ]);

  const [selectedRooms, setSelectedRooms] = useState<string[]>([
    "Salon",
    "Kuchnia",
  ]);

  const [mode, setMode] = useState("normal");

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title);
      setRooms(schedule.rooms);
    }
  }, [schedule]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const toggleRoom = (room: string) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room],
    );
  };

  const handleSave = () => {
    if (!schedule) return;

    const updatedTitle =
      selectedDays.length > 0 ? `${selectedDays.join(", ")} • ${time}` : time;

    const updatedRooms =
      selectedRooms.length > 0 ? selectedRooms.join(", ") : "Brak pomieszczeń";

    onSave({
      ...schedule,
      title: updatedTitle,
      rooms: updatedRooms,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {schedule?.title
              ? "Edytuj harmonogram sprzątania"
              : "Dodaj harmonogram sprzątania"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Harmonogram */}
          <div className="rounded-xl border p-5">
            <h3 className="text-base font-semibold mb-6">Harmonogram</h3>

            <div className="space-y-6">
              <div>
                <Label htmlFor="vacuum-time" className="block mb-2">
                  Godzina rozpoczęcia
                </Label>

                <Input
                  id="vacuum-time"
                  placeholder="10:00"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div>
                <Label className="block mb-3">Dni tygodnia</Label>

                <div className="grid grid-cols-2 gap-3">
                  {DAYS.map((day) => (
                    <label
                      key={day}
                      className="flex items-center gap-3 cursor-pointer rounded-md border p-3 hover:bg-slate-50"
                    >
                      <Checkbox
                        checked={selectedDays.includes(day)}
                        onCheckedChange={() => toggleDay(day)}
                      />

                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="block mb-3">Pomieszczenia</Label>

                <div className="grid grid-cols-2 gap-3">
                  {ROOMS.map((room) => (
                    <label
                      key={room}
                      className="flex items-center gap-3 cursor-pointer rounded-md border p-3 hover:bg-slate-50"
                    >
                      <Checkbox
                        checked={selectedRooms.includes(room)}
                        onCheckedChange={() => toggleRoom(room)}
                      />

                      <span className="text-sm">{room}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ustawienia */}
          <div className="rounded-xl border p-5">
            <h3 className="text-base font-semibold mb-6">
              Ustawienia sprzątania
            </h3>

            <div>
              <Label className="block mb-2">Tryb pracy</Label>

              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="quiet">Cichy</SelectItem>

                  <SelectItem value="normal">Normalny</SelectItem>

                  <SelectItem value="turbo">Turbo</SelectItem>

                  <SelectItem value="max">Maksymalny</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anuluj
          </Button>

          <Button onClick={handleSave}>Zapisz zmiany</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
