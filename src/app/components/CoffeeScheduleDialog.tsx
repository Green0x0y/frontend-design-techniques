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

export interface CoffeeSchedule {
  id: number;
  time: string;
  coffeeType: string;
  days: string[];
}

interface CoffeeScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: CoffeeSchedule | null;
  onSave: (schedule: CoffeeSchedule) => void;
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

export function CoffeeScheduleDialog({
  open,
  onOpenChange,
  schedule,
  onSave,
}: CoffeeScheduleDialogProps) {
  const [time, setTime] = useState("07:00");
  const [coffeeType, setCoffeeType] = useState("Espresso");

  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
  ]);

  useEffect(() => {
    if (!schedule) return;

    setTime(schedule.time);
    setCoffeeType(schedule.coffeeType);
    setSelectedDays(schedule.days);
  }, [schedule]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSave = () => {
    if (!schedule) return;

    onSave({
      ...schedule,
      time,
      coffeeType,
      days: selectedDays,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {schedule?.days?.length
              ? "Edytuj harmonogram kawy"
              : "Dodaj harmonogram kawy"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-xl border p-5">
            <h3 className="text-base font-semibold mb-6">Harmonogram</h3>

            <div className="space-y-6">
              <div>
                <Label className="block mb-2">Godzina przygotowania</Label>

                <Input
                  placeholder="07:00"
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
                      className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-slate-50"
                    >
                      <Checkbox
                        checked={selectedDays.includes(day)}
                        onCheckedChange={() => toggleDay(day)}
                      />

                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-5">
            <h3 className="text-base font-semibold mb-6">Rodzaj kawy</h3>

            <Select value={coffeeType} onValueChange={setCoffeeType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Espresso">Espresso</SelectItem>

                <SelectItem value="Americano">Americano</SelectItem>

                <SelectItem value="Cappuccino">Cappuccino</SelectItem>

                <SelectItem value="Latte">Latte</SelectItem>

                <SelectItem value="Flat White">Flat White</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anuluj
          </Button>

          <Button onClick={handleSave}>Zapisz zmiany</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
