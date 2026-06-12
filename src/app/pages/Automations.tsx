import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Plus, Play, Pause, Trash2, Moon, LogOut, Home, Film, Sun, Zap, Shield, Leaf, AlarmClock } from 'lucide-react';
import {
  scenes as initialScenes,
  automations as initialAutomations,
  devices as devicesCatalog,
} from '../data/mockData';
import type { Scene, Automation } from '../data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

export function Automations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('scenes');
  const [scenesList, setScenesList] = useState(initialScenes);
  const [automationsList, setAutomationsList] = useState(initialAutomations);

  const [sceneDialogOpen, setSceneDialogOpen] = useState(false);
  const [newSceneName, setNewSceneName] = useState('');
  const [newSceneDescription, setNewSceneDescription] = useState('');
  const [newSceneIcon, setNewSceneIcon] = useState('Zap');
  const [sceneDeviceIds, setSceneDeviceIds] = useState<Record<string, boolean>>({});

  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleTrigger, setNewRuleTrigger] = useState('');
  const [newRuleAction, setNewRuleAction] = useState('');

  const focusSceneId = searchParams.get('scene');

  useEffect(() => {
    if (!focusSceneId) return;
    setActiveTab('scenes');
    const t = window.setTimeout(() => {
      document.getElementById(`scene-${focusSceneId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setSearchParams({}, { replace: true });
    }, 100);
    return () => window.clearTimeout(t);
  }, [focusSceneId, setSearchParams]);

  const resetSceneForm = () => {
    setNewSceneName('');
    setNewSceneDescription('');
    setNewSceneIcon('Zap');
    setSceneDeviceIds({});
  };

  const resetRuleForm = () => {
    setNewRuleName('');
    setNewRuleTrigger('');
    setNewRuleAction('');
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, typeof Zap> = {
      Moon,
      LogOut,
      Home,
      Film,
      Sun,
      Zap,
      Shield,
      Leaf,
      AlarmClock,
      Sunrise: Sun,
    };
    return icons[iconName] || Zap;
  };

  const executeScene = (sceneName: string) => {
    toast.success(`Scena "${sceneName}" została uruchomiona`);
  };

  const toggleAutomation = (id: string) => {
    setAutomationsList((prev) =>
      prev.map((auto) => (auto.id === id ? { ...auto, enabled: !auto.enabled } : auto))
    );
  };

  const deleteScene = (id: string) => {
    setScenesList((prev) => prev.filter((scene) => scene.id !== id));
    toast.success('Scena została usunięta');
  };

  const deleteAutomation = (id: string) => {
    setAutomationsList((prev) => prev.filter((auto) => auto.id !== id));
    toast.success('Automatyzacja została usunięta');
  };

  const handleCreateScene = () => {
    const name = newSceneName.trim();
    if (!name) {
      toast.error('Podaj nazwę sceny');
      return;
    }
    const description = newSceneDescription.trim() || 'Brak opisu';
    const deviceIds = Object.entries(sceneDeviceIds)
      .filter(([, on]) => on)
      .map(([id]) => id);
    const newScene: Scene = {
      id: `s${Date.now()}`,
      name,
      icon: newSceneIcon,
      description,
      devices: deviceIds.length ? deviceIds : [],
    };
    setScenesList((prev) => [...prev, newScene]);
    setSceneDialogOpen(false);
    resetSceneForm();
    toast.success('Scena została dodana');
  };

  const handleCreateRule = () => {
    const name = newRuleName.trim();
    if (!name || !newRuleTrigger.trim() || !newRuleAction.trim()) {
      toast.error('Wypełnij nazwę, warunek i akcję');
      return;
    }
    const newAutomation: Automation = {
      id: `a${Date.now()}`,
      name,
      trigger: newRuleTrigger.trim(),
      action: newRuleAction.trim(),
      enabled: true,
      icon: 'Zap',
    };
    setAutomationsList((prev) => [...prev, newAutomation]);
    setRuleDialogOpen(false);
    resetRuleForm();
    toast.success('Reguła została dodana');
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Automatyzacje i sceny</h1>
          <p className="text-slate-600">Twórz sceny i reguły automatyzacji dla swojego domu</p>
        </div>

        {activeTab === 'scenes' ? (
          <Dialog
            open={sceneDialogOpen}
            onOpenChange={(open) => {
              setSceneDialogOpen(open);
              if (!open) resetSceneForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nowa scena
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Utwórz nową scenę</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="scene-name">Nazwa sceny</Label>
                  <Input
                    id="scene-name"
                    placeholder="np. Wieczór filmowy"
                    value={newSceneName}
                    onChange={(e) => setNewSceneName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scene-description">Opis</Label>
                  <Input
                    id="scene-description"
                    placeholder="Krótki opis sceny"
                    value={newSceneDescription}
                    onChange={(e) => setNewSceneDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scene-icon">Ikona</Label>
                  <Select value={newSceneIcon} onValueChange={setNewSceneIcon}>
                    <SelectTrigger id="scene-icon">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Moon">Księżyc</SelectItem>
                      <SelectItem value="Sun">Słońce</SelectItem>
                      <SelectItem value="Home">Dom</SelectItem>
                      <SelectItem value="Film">Film</SelectItem>
                      <SelectItem value="LogOut">Wyjście</SelectItem>
                      <SelectItem value="Zap">Błyskawica</SelectItem>
                      <SelectItem value="Shield">Tarcza</SelectItem>
                      <SelectItem value="Leaf">Liść</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Wybierz urządzenia</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3">
                    {devicesCatalog.map((d) => (
                      <div key={d.id} className="flex items-center justify-between gap-2">
                        <span className="text-sm">
                          {d.room} — {d.name}
                        </span>
                        <Switch
                          checked={!!sceneDeviceIds[d.id]}
                          onCheckedChange={(checked) =>
                            setSceneDeviceIds((prev) => ({ ...prev, [d.id]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <Button type="button" className="w-full" onClick={handleCreateScene}>
                  Utwórz scenę
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog
            open={ruleDialogOpen}
            onOpenChange={(open) => {
              setRuleDialogOpen(open);
              if (!open) resetRuleForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nowa reguła
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Utwórz nową regułę automatyzacji</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="auto-name">Nazwa reguły</Label>
                  <Input
                    id="auto-name"
                    placeholder="np. Automatyczne światło wieczorem"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auto-trigger">Wyzwalacz (warunek)</Label>
                  <Input
                    id="auto-trigger"
                    placeholder="np. Gdy zapadnie zmrok"
                    value={newRuleTrigger}
                    onChange={(e) => setNewRuleTrigger(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auto-action">Akcja</Label>
                  <Input
                    id="auto-action"
                    placeholder="np. Włącz światło w salonie"
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value)}
                  />
                </div>
                <Button type="button" className="w-full" onClick={handleCreateRule}>
                  Utwórz regułę
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="scenes">Sceny</TabsTrigger>
          <TabsTrigger value="automations">Reguły automatyzacji</TabsTrigger>
        </TabsList>

        <TabsContent value="scenes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenesList.map((scene) => {
              const Icon = getIconComponent(scene.icon);

              return (
                <div
                  key={scene.id}
                  id={`scene-${scene.id}`}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all scroll-mt-24"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteScene(scene.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">{scene.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{scene.description}</p>

                  <div className="mb-4 pb-4 border-b border-slate-200">
                    <p className="text-xs text-slate-500 mb-2">{scene.devices.length} urządzeń</p>
                  </div>

                  <Button
                    onClick={() => executeScene(scene.name)}
                    className="w-full flex items-center justify-center gap-2"
                    variant="outline"
                  >
                    <Play className="w-4 h-4" />
                    Uruchom scenę
                  </Button>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="automations" className="space-y-6">
          <div className="space-y-4">
            {automationsList.map((automation) => {
              const Icon = getIconComponent(automation.icon);

              return (
                <div
                  key={automation.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        automation.enabled ? 'bg-green-100' : 'bg-slate-100'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          automation.enabled ? 'text-green-600' : 'text-slate-400'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-semibold text-slate-900">{automation.name}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Switch
                            checked={automation.enabled}
                            onCheckedChange={() => toggleAutomation(automation.id)}
                          />
                          <button
                            type="button"
                            onClick={() => deleteAutomation(automation.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-slate-500 font-medium w-20 flex-shrink-0">Warunek:</span>
                          <span className="text-slate-700">{automation.trigger}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-slate-500 font-medium w-20 flex-shrink-0">Akcja:</span>
                          <span className="text-slate-700">{automation.action}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                            automation.enabled
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {automation.enabled ? (
                            <>
                              <Play className="w-3 h-3" />
                              Aktywna
                            </>
                          ) : (
                            <>
                              <Pause className="w-3 h-3" />
                              Wstrzymana
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
