// Mock data for the smart home application

export interface Device {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'lock' | 'camera' | 'sensor' | 'outlet' | 'blind';
  room: string;
  status: 'on' | 'off' | 'active' | 'inactive';
  value?: number; // for dimmers, thermostats
  battery?: number;
  icon: string;
}

export interface Scene {
  id: string;
  name: string;
  icon: string;
  description: string;
  devices: string[];
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Appliance {
  id: string;
  name: string;
  type: 'vacuum' | 'coffee';
  status: string;
  icon: string;
}

export const devices: Device[] = [
  { id: '1', name: 'Salon - Główne światło', type: 'light', room: 'Salon', status: 'on', value: 80, icon: 'Lightbulb' },
  { id: '2', name: 'Sypialnia - Lampka nocna', type: 'light', room: 'Sypialnia', status: 'off', value: 0, icon: 'Lamp' },
  { id: '3', name: 'Kuchnia - Światło LED', type: 'light', room: 'Kuchnia', status: 'on', value: 100, icon: 'Lightbulb' },
  { id: '4', name: 'Termostat - Salon', type: 'thermostat', room: 'Salon', status: 'active', value: 22, icon: 'Thermometer' },
  { id: '5', name: 'Termostat - Sypialnia', type: 'thermostat', room: 'Sypialnia', status: 'active', value: 20, icon: 'Thermometer' },
  { id: '6', name: 'Zamek - Drzwi główne', type: 'lock', room: 'Wejście', status: 'on', icon: 'Lock' },
  { id: '7', name: 'Kamera - Wejście', type: 'camera', room: 'Wejście', status: 'active', icon: 'Video' },
  { id: '8', name: 'Czujnik ruchu - Korytarz', type: 'sensor', room: 'Korytarz', status: 'active', battery: 85, icon: 'Activity' },
  { id: '9', name: 'Gniazdko - Biuro', type: 'outlet', room: 'Biuro', status: 'on', icon: 'Plug' },
  { id: '10', name: 'Rolety - Salon', type: 'blind', room: 'Salon', status: 'off', value: 0, icon: 'Blinds' },
];

export const scenes: Scene[] = [
  {
    id: 's1',
    name: 'Dobranoc',
    icon: 'Moon',
    description: 'Wyłącz wszystkie światła, zamknij rolety, obniż temperaturę',
    devices: ['1', '2', '3', '4', '5', '10'],
  },
  {
    id: 's2',
    name: 'Wyjście z domu',
    icon: 'LogOut',
    description: 'Wyłącz wszystkie urządzenia, zamknij drzwi, włącz alarm',
    devices: ['1', '2', '3', '6', '9'],
  },
  {
    id: 's3',
    name: 'Powrót do domu',
    icon: 'Home',
    description: 'Włącz światła, ustaw komfortową temperaturę',
    devices: ['1', '3', '4'],
  },
  {
    id: 's4',
    name: 'Film',
    icon: 'Film',
    description: 'Przyciemnij światła, zamknij rolety',
    devices: ['1', '10'],
  },
  {
    id: 's5',
    name: 'Poranek',
    icon: 'Sun',
    description: 'Otwórz rolety, włącz światła, ustaw temperaturę',
    devices: ['1', '3', '4', '10'],
  },
];

export const automations: Automation[] = [
  {
    id: 'a1',
    name: 'Włącz światło o zmierzchu',
    trigger: 'Gdy zachód słońca',
    action: 'Włącz światło w salonie',
    enabled: true,
    icon: 'Sunrise',
  },
  {
    id: 'a2',
    name: 'Alarm - wykryto ruch',
    trigger: 'Gdy czujnik wykryje ruch (noc)',
    action: 'Włącz światło + powiadomienie',
    enabled: true,
    icon: 'Shield',
  },
  {
    id: 'a3',
    name: 'Oszczędzanie energii',
    trigger: 'Gdy brak ruchu przez 30 min',
    action: 'Wyłącz światła i obniż temperaturę',
    enabled: false,
    icon: 'Leaf',
  },
  {
    id: 'a4',
    name: 'Pobudka',
    trigger: 'Każdego dnia o 7:00',
    action: 'Włącz scenę "Poranek"',
    enabled: true,
    icon: 'AlarmClock',
  },
];

export const users: User[] = [
  {
    id: 'u1',
    name: 'Jan Kowalski',
    email: 'jan.kowalski@email.com',
    role: 'admin',
    avatar: 'JK',
  },
  {
    id: 'u2',
    name: 'Anna Kowalska',
    email: 'anna.kowalska@email.com',
    role: 'member',
    avatar: 'AK',
  },
  {
    id: 'u3',
    name: 'Piotr Nowak',
    email: 'piotr.nowak@email.com',
    role: 'member',
    avatar: 'PN',
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'alert',
    message: 'Wykryto ruch przy drzwiach wejściowych',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: 'n2',
    type: 'warning',
    message: 'Czujnik ruchu w korytarzu - niski poziom baterii (15%)',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: 'n3',
    type: 'success',
    message: 'Scena "Dobranoc" została wykonana',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: 'n4',
    type: 'info',
    message: 'Automatyzacja "Włącz światło o zmierzchu" została uruchomiona',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    read: true,
  },
];

export const appliances: Appliance[] = [
  {
    id: 'ap1',
    name: 'Robot odkurzający',
    type: 'vacuum',
    status: 'charging',
    icon: 'Bot',
  },
  {
    id: 'ap2',
    name: 'Ekspres do kawy',
    type: 'coffee',
    status: 'ready',
    icon: 'Coffee',
  },
];

export const energyData = [
  { name: 'Pon', energia: 12.5 },
  { name: 'Wt', energia: 15.2 },
  { name: 'Śr', energia: 11.8 },
  { name: 'Czw', energia: 14.3 },
  { name: 'Pt', energia: 13.7 },
  { name: 'Sob', energia: 18.9 },
  { name: 'Ndz', energia: 16.4 },
];

export const deviceUsageData = [
  { name: 'Oświetlenie', value: 35 },
  { name: 'Ogrzewanie', value: 40 },
  { name: 'AGD', value: 15 },
  { name: 'Inne', value: 10 },
];
