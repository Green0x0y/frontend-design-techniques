import { useState } from "react";
import {
  Plus,
  Settings,
  Trash2,
  Lightbulb,
  Thermometer,
  Lock,
  Video,
  Activity,
  Power,
} from "lucide-react";
import { devices as initialDevices } from "../data/mockData";
import type { Device } from "../data/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { DeviceStatusBadge } from '../components/DeviceStatusBadge';
import { toast } from "sonner";

function iconForDeviceType(type: Device["type"]): string {
  const map: Record<Device["type"], string> = {
    light: "Lightbulb",
    thermostat: "Thermometer",
    lock: "Lock",
    camera: "Video",
    sensor: "Activity",
    outlet: "Plug",
    blind: "Blinds",
  };
  return map[type];
}

function defaultDeviceFields(
  type: Device["type"],
  name: string,
  room: string,
): Omit<Device, "id"> {
  switch (type) {
    case "light":
      return {
        name,
        type,
        room,
        status: "off",
        value: 0,
        icon: iconForDeviceType(type),
      };
    case "thermostat":
      return {
        name,
        type,
        room,
        status: "active",
        value: 21,
        icon: iconForDeviceType(type),
      };
    case "lock":
      return { name, type, room, status: "off", icon: iconForDeviceType(type) };
    case "camera":
      return {
        name,
        type,
        room,
        status: "active",
        icon: iconForDeviceType(type),
      };
    case "sensor":
      return {
        name,
        type,
        room,
        status: "active",
        battery: 100,
        icon: iconForDeviceType(type),
      };
    case "outlet":
      return { name, type, room, status: "off", icon: iconForDeviceType(type) };
    case "blind":
      return {
        name,
        type,
        room,
        status: "off",
        value: 0,
        icon: iconForDeviceType(type),
      };
  }
}

export function Devices() {
  const [deviceList, setDeviceList] = useState(initialDevices);
  const [filterRoom, setFilterRoom] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceRoom, setNewDeviceRoom] = useState("");
  const [newDeviceType, setNewDeviceType] = useState<Device["type"] | "">("");

  const toggleDevice = (id: string) => {
    setDeviceList((prev) =>
      prev.map((device) =>
        device.id === id
          ? {
              ...device,
              status:
                device.status === "on" || device.status === "active"
                  ? "off"
                  : "on",
            }
          : device,
      ),
    );
  };

  const deleteDevice = (id: string) => {
    setDeviceList((prev) => prev.filter((device) => device.id !== id));
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Lightbulb,
      Thermometer,
      Lock,
      Video,
      Activity,
      Lamp: Lightbulb,
      Plug: Power,
      Blinds: Settings,
    };
    return icons[iconName] || Lightbulb;
  };

  const rooms = ["all", ...Array.from(new Set(deviceList.map((d) => d.room)))];
  const types = [
    "all",
    "light",
    "thermostat",
    "lock",
    "camera",
    "sensor",
    "outlet",
    "blind",
  ];

  const filteredDevices = deviceList.filter((device) => {
    const roomMatch = filterRoom === "all" || device.room === filterRoom;
    const typeMatch = filterType === "all" || device.type === filterType;
    return roomMatch && typeMatch;
  });

  const resetAddDeviceForm = () => {
    setNewDeviceName("");
    setNewDeviceRoom("");
    setNewDeviceType("");
  };

  const handleAddDevice = () => {
    const name = newDeviceName.trim();
    const room = newDeviceRoom.trim();
    if (!name || !room || !newDeviceType) {
      toast.error("Wypełnij nazwę, typ i pomieszczenie");
      return;
    }
    const maxNumericId = deviceList.reduce((max, d) => {
      const n = parseInt(d.id, 10);
      return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 0);
    const newId = String(maxNumericId + 1);
    const base = defaultDeviceFields(newDeviceType, name, room);
    const newDevice: Device = { id: newId, ...base };
    setDeviceList((prev) => [...prev, newDevice]);
    setAddDialogOpen(false);
    resetAddDeviceForm();
    toast.success("Urządzenie zostało dodane");
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Urządzenia</h1>
          <p className="text-slate-600">
            Zarządzaj wszystkimi urządzeniami w domu
          </p>
        </div>

        <Dialog
          open={addDialogOpen}
          onOpenChange={(open) => {
            setAddDialogOpen(open);
            if (!open) resetAddDeviceForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Dodaj urządzenie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nowe urządzenie</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="device-name">Nazwa urządzenia</Label>
                <Input
                  id="device-name"
                  placeholder="np. Lampa sufitowa"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="device-type">Typ urządzenia</Label>
                <Select
                  value={newDeviceType || undefined}
                  onValueChange={(v) => setNewDeviceType(v as Device["type"])}
                >
                  <SelectTrigger id="device-type">
                    <SelectValue placeholder="Wybierz typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Oświetlenie</SelectItem>
                    <SelectItem value="thermostat">Termostat</SelectItem>
                    <SelectItem value="lock">Zamek</SelectItem>
                    <SelectItem value="camera">Kamera</SelectItem>
                    <SelectItem value="sensor">Czujnik</SelectItem>
                    <SelectItem value="outlet">Gniazdko</SelectItem>
                    <SelectItem value="blind">Rolety</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="device-room">Pomieszczenie</Label>
                <Input
                  id="device-room"
                  placeholder="np. Salon"
                  value={newDeviceRoom}
                  onChange={(e) => setNewDeviceRoom(e.target.value)}
                />
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={handleAddDevice}
              >
                Dodaj urządzenie
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="filter-room" className="text-sm mb-2 block">
              Pomieszczenie
            </Label>
            <Select value={filterRoom} onValueChange={setFilterRoom}>
              <SelectTrigger id="filter-room">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                {rooms
                  .filter((r) => r !== "all")
                  .map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label htmlFor="filter-type" className="text-sm mb-2 block">
              Typ urządzenia
            </Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger id="filter-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="light">Oświetlenie</SelectItem>
                <SelectItem value="thermostat">Termostaty</SelectItem>
                <SelectItem value="lock">Zamki</SelectItem>
                <SelectItem value="camera">Kamery</SelectItem>
                <SelectItem value="sensor">Czujniki</SelectItem>
                <SelectItem value="outlet">Gniazdka</SelectItem>
                <SelectItem value="blind">Rolety</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device) => {
          const Icon = getIconComponent(device.icon);
          const isActive = device.status === "on" || device.status === "active";

          return (
            <div
              key={device.id}
              className={`bg-white rounded-xl p-6 shadow-sm border transition-all flex flex-col ${
                isActive ? "border-blue-300 bg-blue-50" : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isActive ? "bg-blue-600" : "bg-slate-100"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${isActive ? "text-white" : "text-slate-600"}`}
                  />
                </div>

                <div className="flex gap-2">
                  <DeviceStatusBadge isActive={isActive} onToggle={() => toggleDevice(device.id)} />
                </div>
              </div>

              <h3 className="font-semibold text-slate-900 mb-1">
                {device.name}
              </h3>
              <p className="text-sm text-slate-600 mb-4">{device.room}</p>

              {device.value !== undefined && device.type === "light" && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Jasność</span>
                    <span className="font-medium text-slate-900">
                      {device.value}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={device.value}
                    disabled={!isActive}
                    className="w-full"
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      setDeviceList((prev) =>
                        prev.map((d) =>
                          d.id === device.id ? { ...d, value: newValue } : d,
                        ),
                      );
                    }}
                  />
                </div>
              )}

              {device.value !== undefined && device.type === "thermostat" && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Temperatura</span>
                    <span className="font-medium text-slate-900">
                      {device.value}°C
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium"
                      onClick={() => {
                        setDeviceList((prev) =>
                          prev.map((d) =>
                            d.id === device.id && d.value !== undefined
                              ? { ...d, value: d.value - 1 }
                              : d,
                          ),
                        );
                      }}
                    >
                      -
                    </button>
                    <button
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium"
                      onClick={() => {
                        setDeviceList((prev) =>
                          prev.map((d) =>
                            d.id === device.id && d.value !== undefined
                              ? { ...d, value: d.value + 1 }
                              : d,
                          ),
                        );
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {device.battery !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Bateria</span>
                    <span className="font-medium text-slate-900">
                      {device.battery}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        device.battery > 50
                          ? "bg-green-500"
                          : device.battery > 20
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${device.battery}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-slate-200">
                <button
                  onClick={() => deleteDevice(device.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Usuń
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">
            Nie znaleziono urządzeń spełniających kryteria
          </p>
        </div>
      )}
    </div>
  );
}
