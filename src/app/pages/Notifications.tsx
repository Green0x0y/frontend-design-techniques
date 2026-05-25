import { useState } from 'react';
import { Bell, Check, Trash2, Settings, AlertTriangle, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { notifications as initialNotifications } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function Notifications() {
  const [notificationsList, setNotificationsList] = useState(initialNotifications);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [deviceStatus, setDeviceStatus] = useState(true);
  const [automationAlerts, setAutomationAlerts] = useState(true);
  const [energyReports, setEnergyReports] = useState(false);

  const markAsRead = (id: string) => {
    setNotificationsList((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((notif) => ({ ...notif, read: true })));
    toast.success('Wszystkie powiadomienia zostały oznaczone jako przeczytane');
  };

  const deleteNotification = (id: string) => {
    setNotificationsList((prev) => prev.filter((notif) => notif.id !== id));
    toast.success('Powiadomienie zostało usunięte');
  };

  const clearAll = () => {
    setNotificationsList([]);
    toast.success('Wszystkie powiadomienia zostały usunięte');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} sekund temu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minut temu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} godzin temu`;
    return date.toLocaleDateString('pl-PL');
  };

  const getIconAndColor = (type: string) => {
    switch (type) {
      case 'alert':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          iconBg: 'bg-red-100',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          iconBg: 'bg-yellow-100',
        };
      case 'success':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          iconBg: 'bg-green-100',
        };
      case 'info':
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
        };
    }
  };

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-900">Powiadomienia</h1>
        </div>
        <p className="text-slate-600">Śledź wszystkie zdarzenia w swoim inteligentnym domu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={markAllAsRead} variant="outline" size="sm" disabled={unreadCount === 0}>
              <Check className="w-4 h-4 mr-2" />
              Oznacz wszystkie jako przeczytane
            </Button>
            <Button
              onClick={clearAll}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              disabled={notificationsList.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Wyczyść wszystkie
            </Button>
          </div>

          {/* Notifications */}
          {notificationsList.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
              <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Brak powiadomień</h3>
              <p className="text-slate-600">Wszystkie powiadomienia zostały wyczyszczone</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notificationsList.map((notification) => {
                const { icon: Icon, bgColor, borderColor, iconColor, iconBg } = getIconAndColor(
                  notification.type
                );

                return (
                  <div
                    key={notification.id}
                    className={`rounded-xl p-4 border transition-all ${
                      notification.read ? 'bg-white opacity-60' : bgColor
                    } ${borderColor}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`font-medium mb-1 ${notification.read ? 'text-slate-600' : 'text-slate-900'}`}>
                          {notification.message}
                        </p>
                        <p className="text-sm text-slate-500">{formatTime(notification.timestamp)}</p>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && (
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteNotification(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
{/* Settings Sidebar */}
        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-bold text-slate-900">Ustawienia</h2>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label htmlFor="notifications-toggle" className="font-medium text-slate-900">Powiadomienia</Label>
                  <p className="text-sm text-slate-600 mt-1">Włącz lub wyłącz wszystkie powiadomienia</p>
                </div>
                <Switch id="notifications-toggle" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label htmlFor="device-status-toggle" className="font-medium text-slate-900">Status urządzeń</Label>
                  <p className="text-sm text-slate-600 mt-1">Powiadomienia o zmianach stanu</p>
                </div>
                <Switch id="device-status-toggle" checked={deviceStatus} onCheckedChange={setDeviceStatus} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label htmlFor="automation-toggle" className="font-medium text-slate-900">Alerty automatyzacji</Label>
                  <p className="text-sm text-slate-600 mt-1">Powiadomienia o regułach</p>
                </div>
                <Switch id="automation-toggle" checked={automationAlerts} onCheckedChange={setAutomationAlerts} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label htmlFor="energy-toggle" className="font-medium text-slate-900">Raporty energii</Label>
                  <p className="text-sm text-slate-600 mt-1">Tygodniowe podsumowania</p>
                </div>
                <Switch id="energy-toggle" checked={energyReports} onCheckedChange={setEnergyReports} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
