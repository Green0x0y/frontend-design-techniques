import { useState } from 'react';
import { Shield, AlertTriangle, Lock, Activity, Volume2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';

export function Security() {
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [motionDetection, setMotionDetection] = useState(true);
  const [doorSensors, setDoorSensors] = useState(true);
  const [criticalAlert, setCriticalAlert] = useState(false);

  const simulateAlert = () => {
    setCriticalAlert(true);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Critical Alert Dialog */}
      <Dialog open={criticalAlert} onOpenChange={setCriticalAlert}>
        <DialogContent className="max-w-md border-red-500 border-2">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-red-600 text-2xl">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
              ALERT
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex gap-2">
              <Button onClick={() => setCriticalAlert(false)} className="flex-1" variant="destructive">
                Wyłącz alarm
              </Button>
              <Button onClick={() => setCriticalAlert(false)} className="flex-1" variant="outline">
                Fałszywy alarm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Monitoring i bezpieczeństwo</h1>
        <p className="text-slate-600">Chroń swój dom dzięki zaawansowanemu systemowi bezpieczeństwa</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              alarmEnabled ? 'bg-red-100' : 'bg-slate-100'
            }`}>
              <Shield className={`w-6 h-6 ${alarmEnabled ? 'text-red-600' : 'text-slate-400'}`} />
            </div>
            <Switch checked={alarmEnabled} onCheckedChange={setAlarmEnabled} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">System alarmowy</h3>
          <p className="text-sm text-slate-600">
            {alarmEnabled ? 'Alarm aktywny' : 'Alarm wyłączony'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              motionDetection ? 'bg-blue-100' : 'bg-slate-100'
            }`}>
              <Activity className={`w-6 h-6 ${motionDetection ? 'text-blue-600' : 'text-slate-400'}`} />
            </div>
            <Switch checked={motionDetection} onCheckedChange={setMotionDetection} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Czujniki ruchu</h3>
          <p className="text-sm text-slate-600">
            {motionDetection ? '3 aktywne' : 'Wyłączone'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              doorSensors ? 'bg-purple-100' : 'bg-slate-100'
            }`}>
              <Lock className={`w-6 h-6 ${doorSensors ? 'text-purple-600' : 'text-slate-400'}`} />
            </div>
            <Switch checked={doorSensors} onCheckedChange={setDoorSensors} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Czujniki drzwi/okien</h3>
          <p className="text-sm text-slate-600">
            {doorSensors ? '5 aktywnych' : 'Wyłączone'}
          </p>
        </div>
      </div>

      {/* Test Alert Button */}
      <div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-2">Test Alertu</h3>
              <p className="text-sm text-yellow-700 mb-4">Przykład: "Czujnik wykrył ruch w korytarzu"</p>
              <Button onClick={simulateAlert} variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-100">
                Symuluj zagrożenie
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}