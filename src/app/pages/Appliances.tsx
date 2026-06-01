import { useState } from "react";
import {
  Bot,
  Coffee,
  Play,
  Pause,
  Settings,
  MapPin,
  Clock,
  ThermometerSun,
  Droplet,
  Gauge,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { toast } from "sonner";
import {
  VacuumScheduleDialog,
  VacuumSchedule,
} from "../components/VacuumScheduleDialog";
import {
  CoffeeScheduleDialog,
  CoffeeSchedule,
} from "../components/CoffeeScheduleDialog";

export function Appliances() {
  const [vacuumStatus, setVacuumStatus] = useState<
    "cleaning" | "charging" | "idle"
  >("idle");
  const [vacuumMode, setVacuumMode] = useState("normal");
  const [vacuumBattery, setVacuumBattery] = useState(85);

  const [vacuumSchedules, setVacuumSchedules] = useState<VacuumSchedule[]>([
    {
      id: 1,
      title: "Codziennie o 10:00",
      rooms: "Wszystkie pomieszczenia",
    },
    {
      id: 2,
      title: "Poniedziałek, Czwartek 14:00",
      rooms: "Salon i kuchnia",
    },
  ]);

  const [selectedSchedule, setSelectedSchedule] =
    useState<VacuumSchedule | null>(null);

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const openNewScheduleDialog = () => {
    setSelectedSchedule({
      id: Date.now(),
      title: "",
      rooms: "",
    });

    setScheduleDialogOpen(true);
  };

  const [coffeeStatus, setCoffeeStatus] = useState<
    "ready" | "brewing" | "cleaning"
  >("ready");
  const [coffeeStrength, setCoffeeStrength] = useState([3]);
  const [coffeeSize, setCoffeeSize] = useState("medium");
  const [coffeeTemperature, setCoffeeTemperature] = useState([85]);

  const [selectedCoffeeType, setSelectedCoffeeType] = useState("Espresso");

  const startVacuum = () => {
    setVacuumStatus("cleaning");
    toast.success("Robot odkurzający rozpoczął sprzątanie");
  };

  const stopVacuum = () => {
    setVacuumStatus("idle");
    toast.info("Robot odkurzający został zatrzymany");
  };

  const updateSchedule = (updatedSchedule: VacuumSchedule) => {
    const exists = vacuumSchedules.some((s) => s.id === updatedSchedule.id);

    if (exists) {
      setVacuumSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === updatedSchedule.id ? updatedSchedule : schedule,
        ),
      );
    } else {
      setVacuumSchedules((prev) => [...prev, updatedSchedule]);
    }

    toast.success("Harmonogram został zapisany");
  };

  const updateCoffeeSchedule = (updatedSchedule: CoffeeSchedule) => {
    const exists = coffeeSchedules.some((s) => s.id === updatedSchedule.id);

    if (exists) {
      setCoffeeSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === updatedSchedule.id ? updatedSchedule : schedule,
        ),
      );
    } else {
      setCoffeeSchedules((prev) => [...prev, updatedSchedule]);
    }

    toast.success("Harmonogram kawy zapisany");
  };

  const brewCoffee = () => {
    setCoffeeStatus("brewing");
    toast.success("Rozpoczęto przygotowywanie kawy");
    setTimeout(() => {
      setCoffeeStatus("ready");
      toast.success("Kawa jest gotowa!");
    }, 5000);
  };

  const rooms = [
    { name: "Salon", cleaned: true, area: 25 },
    { name: "Kuchnia", cleaned: true, area: 15 },
    { name: "Sypialnia", cleaned: false, area: 20 },
    { name: "Łazienka", cleaned: false, area: 8 },
  ];

  const [coffeeSchedules, setCoffeeSchedules] = useState<CoffeeSchedule[]>([
    {
      id: 1,
      time: "07:00",
      coffeeType: "Espresso",
      days: ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"],
    },
    {
      id: 2,
      time: "14:00",
      coffeeType: "Latte",
      days: ["Sobota", "Niedziela"],
    },
  ]);

  const [coffeeDialogOpen, setCoffeeDialogOpen] = useState(false);

  const [selectedCoffeeSchedule, setSelectedCoffeeSchedule] =
    useState<CoffeeSchedule | null>(null);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Urządzenia AGD
        </h1>
        <p className="text-slate-600">
          Steruj zaawansowanymi urządzeniami domowymi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Robot Vacuum */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bot className="w-7 h-7 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900">
                  Robot odkurzający
                </h2>
                <p className="text-sm text-slate-600">
                  Model: SmartClean Pro X500
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  vacuumStatus === "cleaning"
                    ? "bg-green-100 text-green-700"
                    : vacuumStatus === "charging"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                {vacuumStatus === "cleaning"
                  ? "Sprząta"
                  : vacuumStatus === "charging"
                    ? "Ładuje się"
                    : "Bezczynny"}
              </div>
            </div>
          </div>

          <div className="p-6">
            <Tabs defaultValue="control">
              <TabsList className="mb-6">
                <TabsTrigger value="control">Sterowanie</TabsTrigger>
                <TabsTrigger value="map">Mapa</TabsTrigger>
                <TabsTrigger value="schedule">Harmonogram</TabsTrigger>
              </TabsList>

              <TabsContent value="control" className="space-y-6">
                {/* Battery */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      Poziom baterii
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {vacuumBattery}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        vacuumBattery > 50
                          ? "bg-green-500"
                          : vacuumBattery > 20
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${vacuumBattery}%` }}
                    />
                  </div>
                </div>

                {/* Mode Selection */}
                <div className="space-y-2">
                  <Label htmlFor="vacuum-mode">Tryb sprzątania</Label>
                  <Select value={vacuumMode} onValueChange={setVacuumMode}>
                    <SelectTrigger id="vacuum-mode">
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

                {/* Control Buttons */}
                <div className="space-y-2">
                  {vacuumStatus === "cleaning" ? (
                    <Button
                      onClick={stopVacuum}
                      variant="destructive"
                      className="w-full"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Zatrzymaj sprzątanie
                    </Button>
                  ) : (
                    <Button onClick={startVacuum} className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Rozpocznij sprzątanie
                    </Button>
                  )}
                  <Button variant="outline" className="w-full">
                    Wróć do bazy
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="map" className="space-y-4">
                <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <MapPin className="w-12 h-12 text-slate-400" />
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-4 gap-2">
                    {rooms.map((room) => (
                      <div
                        key={room.name}
                        className={`rounded-lg border-2 flex items-center justify-center ${
                          room.cleaned
                            ? "bg-green-50 border-green-300"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        <div className="text-center">
                          <p className="text-xs font-medium text-slate-700">
                            {room.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {room.area} m²
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-50 border-2 border-green-300 rounded" />
                    <span className="text-slate-600">Wyczyszczone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border-2 border-slate-300 rounded" />
                    <span className="text-slate-600">Do wyczyszczenia</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <p className="text-sm text-slate-600 mb-4">
                  Zaplanuj automatyczne sprzątanie
                </p>

                <div className="space-y-2">
                  {vacuumSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="bg-slate-50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {schedule.title}
                        </p>

                        <p className="text-sm text-slate-600">
                          {schedule.rooms}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setScheduleDialogOpen(true);
                        }}
                      >
                        Edytuj
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={openNewScheduleDialog}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Dodaj harmonogram
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Coffee Machine */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-100 rounded-lg flex items-center justify-center">
                <Coffee className="w-7 h-7 text-amber-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900">
                  Ekspres do kawy
                </h2>
                <p className="text-sm text-slate-600">
                  Model: BrewMaster Elite
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  coffeeStatus === "brewing"
                    ? "bg-amber-100 text-amber-700"
                    : coffeeStatus === "cleaning"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {coffeeStatus === "brewing"
                  ? "Parzy"
                  : coffeeStatus === "cleaning"
                    ? "Czyszczenie"
                    : "Gotowy"}
              </div>
            </div>
          </div>

          <div className="p-6">
            <Tabs defaultValue="brew">
              <TabsList className="mb-6">
                <TabsTrigger value="brew">Zaparz</TabsTrigger>
                <TabsTrigger value="schedule">Harmonogram</TabsTrigger>
              </TabsList>

              <TabsContent value="brew" className="space-y-6">
                {/* Coffee Size */}
                <div className="space-y-2">
                  <Label htmlFor="coffee-size">Rozmiar napoju</Label>
                  <Select value={coffeeSize} onValueChange={setCoffeeSize}>
                    <SelectTrigger id="coffee-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Mały (40ml)</SelectItem>
                      <SelectItem value="medium">Średni (80ml)</SelectItem>
                      <SelectItem value="large">Duży (120ml)</SelectItem>
                      <SelectItem value="xlarge">Extra duży (180ml)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Coffee Strength */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="coffee-strength">Moc kawy</Label>
                    <span className="text-sm font-medium text-slate-900">
                      {coffeeStrength[0] === 1
                        ? "Słaba"
                        : coffeeStrength[0] === 2
                          ? "Średnia"
                          : coffeeStrength[0] === 3
                            ? "Mocna"
                            : "Bardzo mocna"}
                    </span>
                  </div>
                  <Slider
                    id="coffee-strength"
                    value={coffeeStrength}
                    onValueChange={setCoffeeStrength}
                    min={1}
                    max={4}
                    step={1}
                  />
                </div>

                {/* Coffee Temperature */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="coffee-temp">Temperatura</Label>
                    <span className="text-sm font-medium text-slate-900">
                      {coffeeTemperature[0]}°C
                    </span>
                  </div>
                  <Slider
                    id="coffee-temp"
                    value={coffeeTemperature}
                    onValueChange={setCoffeeTemperature}
                    min={70}
                    max={95}
                    step={5}
                  />
                </div>

                {/* Quick Presets */}
                <div className="space-y-2">
                  <Label>Szybkie ustawienia</Label>

                  <div className="grid grid-cols-2 gap-3">
                    {["Espresso", "Americano", "Cappuccino", "Latte"].map(
                      (type) => (
                        <Button
                          key={type}
                          variant="outline"
                          onClick={() => setSelectedCoffeeType(type)}
                          className={`h-auto py-4 flex flex-col transition-all duration-200 ${
                            selectedCoffeeType === type
                              ? "border-2 border-amber-500 bg-amber-50 shadow-md"
                              : ""
                          }`}
                        >
                          <Coffee
                            className={`w-5 h-5 mb-2 ${
                              selectedCoffeeType === type
                                ? "text-amber-600"
                                : ""
                            }`}
                          />

                          <span
                            className={`text-xs ${
                              selectedCoffeeType === type
                                ? "font-semibold text-amber-700"
                                : ""
                            }`}
                          >
                            {type}
                          </span>
                        </Button>
                      ),
                    )}
                  </div>
                </div>

                {/* Brew Button */}
                <Button
                  onClick={brewCoffee}
                  disabled={coffeeStatus === "brewing"}
                  className="w-full"
                  size="lg"
                >
                  {coffeeStatus === "brewing" ? (
                    <>Przygotowywanie...</>
                  ) : (
                    <>
                      <Coffee className="w-4 h-4 mr-2" />
                      Zaparz kawę
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <p className="text-sm text-slate-600 mb-4">
                  Automatycznie przygotuj kawę o wybranej godzinie
                </p>

                <div className="space-y-2">
                  {coffeeSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="bg-slate-50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {schedule.time}
                        </p>

                        <p className="text-sm text-slate-600">
                          {schedule.coffeeType}
                        </p>

                        <p className="text-xs text-slate-500">
                          {schedule.days.join(", ")}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCoffeeSchedule(schedule);
                          setCoffeeDialogOpen(true);
                        }}
                      >
                        Edytuj
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCoffeeSchedule({
                      id: Date.now(),
                      time: "07:00",
                      coffeeType: "Espresso",
                      days: [],
                    });

                    setCoffeeDialogOpen(true);
                  }}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Dodaj harmonogram
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <VacuumScheduleDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          schedule={selectedSchedule}
          onSave={updateSchedule}
        />
        <CoffeeScheduleDialog
          open={coffeeDialogOpen}
          onOpenChange={setCoffeeDialogOpen}
          schedule={selectedCoffeeSchedule}
          onSave={updateCoffeeSchedule}
        />
      </div>
    </div>
  );
}
