export interface Vehicle {
  id: string;
  regNumber: string;
  model: string;
  type: string;
  healthScore: number;
  status: 'Active' | 'Maintenance' | 'Accident' | 'Off Track' | 'Idle';
  fuelLevel: number;
  mileage: number;
  gpsLink: string;
  currentSpeed: number;
  assignedDriverId: string | null;
  currentOrderId: string | null;
  fastagStatus: string;
  fcExpiry: string;
  insExpiry: string;
  permitExpiry: string;
  fitnessExpiry: string;
  taxExpiry: string;
  pollutionExpiry: string;
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  exp: number;
  rating: number;
  status: 'On Trip' | 'Available' | 'On Leave';
  phone: string;
  address: string;
  joinDate: string;
  assignedVehicleId: string | null;
  recentTrips: Trip[];
}

export interface Trip {
  id: number;
  from: string;
  to: string;
  date: string;
  status: string;
}

export interface Booking {
  id: string;
  client: string;
  from: string;
  to: string;
  vehicle: string;
  driver: string;
  status: 'In Transit' | 'Pending' | 'Scheduled' | 'Completed';
  date: string;
  value: string;
  items: string;
  estDays: number;
  manager: string;
}

export interface FuelEntry {
  id: number;
  vehicle: string;
  date: string;
  liters: number;
  cost: number;
  station: string;
  credit: boolean;
}

export interface User {
  role: 'owner' | 'manager';
  name: string;
}

export interface Alert {
  id: string;
  vehicle: Vehicle;
  type: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  icon: any;
  color: string;
}