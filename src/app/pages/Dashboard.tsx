import { useState } from 'react';
import { Link } from 'react-router';
import {
  Lightbulb,
  Thermometer,
  Lock,
  Video,
  Activity,
  Moon,
  LogOut,
  Home,
  Film,
  Sun,
  ArrowRight,
  Power,
  Settings
} from 'lucide-react';
import { devices, scenes } from '../data/mockData';

export function Dashboard() {
  const [deviceStates, setDeviceStates] = useState(devices);

  const toggleDevice = (id: string) => {
    setDeviceStates((prev) =>
      prev.map((device) =>
        device.id === id
          ? {
              ...device,
              status: device.status === 'on' || device.status === 'active' ? 'off' : 'on',
            }
          : device
      )
    );
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Lightbulb,
      Thermometer,
      Lock,
      Video,
      Activity,
      Moon,
      LogOut,
      Home,
      Film,
      Sun,
      Lamp: Lightbulb,
      Plug: Power,
      Blinds: Settings,
    };
    return icons[iconName] || Lightbulb;
  };

  const mainDevices = deviceStates.slice(0, 6);
  const quickScenes = scenes.slice(0, 4);

  const homeStatus = {
    temperature: 22,
    lightsOn: deviceStates.filter((d) => d.type === 'light' && d.status === 'on').length,
    totalLights: deviceStates.filter((d) => d.type === 'light').length,
    locked: deviceStates.find((d) => d.type === 'lock')?.status === 'on',
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Witaj w systemie zarządzania inteligentnym domem</p>
      </div>

      {/* Home Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Temperatura</p>
              <p className="text-3xl font-bold text-slate-900">{homeStatus.temperature}°C</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Thermometer className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Oświetlenie</p>
              <p className="text-3xl font-bold text-slate-900">
                {homeStatus.lightsOn}/{homeStatus.totalLights}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Bezpieczeństwo</p>
              <p className="text-3xl font-bold text-slate-900">
                {homeStatus.locked ? 'Czujniki włączone' : 'Czujniki wyłączone'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              homeStatus.locked ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Lock className={`w-6 h-6 ${homeStatus.locked ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions / Scenes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Szybkie akcje</h2>
          <Link to="/automations" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
            Zobacz wszystkie
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickScenes.map((scene) => {
            const Icon = getIconComponent(scene.icon);
            return (
              <Link
                key={scene.id}
                to={`/automations?scene=${encodeURIComponent(scene.id)}`}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow text-left block"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{scene.name}</h3>
                <p className="text-sm text-slate-600">{scene.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Devices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Główne urządzenia</h2>
          <Link to="/devices" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
            Zobacz wszystkie
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainDevices.map((device) => {
            const Icon = getIconComponent(device.icon);
            const isActive = device.status === 'on' || device.status === 'active';
            
            return (
              <div
                key={device.id}
                className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${
                  isActive
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-blue-600' : 'bg-slate-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  
                  <button
                    onClick={() => toggleDevice(device.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {isActive ? 'Włączone' : 'Wyłączone'}
                  </button>
                </div>
                
                <h3 className="font-semibold text-slate-900 mb-1">{device.name}</h3>
                <p className="text-sm text-slate-600">{device.room}</p>
                
                {device.value !== undefined && device.type === 'light' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600">Jasność</span>
                      <span className="font-medium text-slate-900">{device.value}%</span>
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
                        setDeviceStates((prev) =>
                          prev.map((d) =>
                            d.id === device.id ? { ...d, value: newValue } : d
                          )
                        );
                      }}
                    />
                  </div>
                )}
                
                {device.value !== undefined && device.type === 'thermostat' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600">Ustawiona temperatura</span>
                      <span className="font-medium text-slate-900">{device.value}°C</span>
                    </div>
                  </div>
                )}
                
                {device.battery !== undefined && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Bateria</span>
                      <span className="font-medium text-slate-900">{device.battery}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}