import { Vehicle, Driver, Booking, FuelEntry } from '../types';

export const generateMockVehicles = (): Vehicle[] => [
  {
    id: 'v1', regNumber: 'TN-38-BZ-1001', model: 'Volvo FH16', type: 'Heavy Truck', healthScore: 92, status: 'Active',
    fuelLevel: 75, mileage: 120000, gpsLink: 'https://maps.google.com/?q=13.0827,80.2707', currentSpeed: 65,
    assignedDriverId: 'd1', currentOrderId: 'b1', fastagStatus: 'Active',
    fcExpiry: '2025-12-01', insExpiry: '2025-10-15', permitExpiry: '2026-01-20', fitnessExpiry: '2025-11-30', taxExpiry: '2025-06-15', pollutionExpiry: '2024-09-10'
  },
  {
    id: 'v2', regNumber: 'KA-01-HG-9922', model: 'Tata Prima', type: 'Lorry', healthScore: 65, status: 'Maintenance',
    fuelLevel: 20, mileage: 340000, gpsLink: '', currentSpeed: 0,
    assignedDriverId: null, currentOrderId: null, fastagStatus: 'Low Balance',
    fcExpiry: '2023-11-20', insExpiry: '2024-01-10', permitExpiry: '2024-02-15', fitnessExpiry: '2023-12-01', taxExpiry: '2024-03-20', pollutionExpiry: '2023-10-05'
  },
  {
    id: 'v3', regNumber: 'MH-12-PQ-4455', model: 'Ashok Leyland', type: 'Container', healthScore: 88, status: 'Active',
    fuelLevel: 90, mileage: 85000, gpsLink: 'https://maps.google.com/?q=19.0760,72.8777', currentSpeed: 55,
    assignedDriverId: 'd3', currentOrderId: 'b2', fastagStatus: 'Active',
    fcExpiry: '2024-06-15', insExpiry: '2024-08-20', permitExpiry: '2025-05-10', fitnessExpiry: '2024-07-01', taxExpiry: '2024-12-12', pollutionExpiry: '2024-05-20'
  },
  {
    id: 'v4', regNumber: 'DL-04-XY-7788', model: 'Eicher Pro', type: 'Light Truck', healthScore: 35, status: 'Accident',
    fuelLevel: 0, mileage: 410000, gpsLink: '', currentSpeed: 0,
    assignedDriverId: null, currentOrderId: null, fastagStatus: 'Blacklisted',
    fcExpiry: '2024-01-05', insExpiry: '2023-12-01', permitExpiry: '2023-11-15', fitnessExpiry: '2023-12-20', taxExpiry: '2024-01-10', pollutionExpiry: '2023-11-01'
  },
];

export const generateMockDrivers = (): Driver[] => [
  {
    id: 'd1', name: 'Rajesh Kumar', license: 'DL-99827382', exp: 8, rating: 4.8, status: 'On Trip',
    phone: '9876543210', address: '123 Main St, Delhi', joinDate: '2020-01-15', assignedVehicleId: 'v1',
    recentTrips: [
      { id: 101, from: 'Chennai', to: 'Bangalore', date: '2024-03-01', status: 'Completed' },
      { id: 102, from: 'Bangalore', to: 'Mumbai', date: '2024-02-25', status: 'Completed' }
    ]
  },
  {
    id: 'd2', name: 'Suresh Menon', license: 'KA-28371922', exp: 5, rating: 4.2, status: 'Available',
    phone: '8765432109', address: '45 cross St, Bangalore', joinDate: '2021-06-20', assignedVehicleId: null,
    recentTrips: []
  },
  {
    id: 'd3', name: 'Vikram Singh', license: 'MH-11223344', exp: 12, rating: 4.9, status: 'On Leave',
    phone: '7654321098', address: '789 High Rd, Mumbai', joinDate: '2019-03-10', assignedVehicleId: 'v3',
    recentTrips: [
      { id: 103, from: 'Pune', to: 'Hyderabad', date: '2024-02-15', status: 'Completed' }
    ]
  },
];

export const generateMockBookings = (): Booking[] => [
  { id: 'b1', client: 'Amazon Logistics', from: 'Chennai', to: 'Bangalore', vehicle: 'TN-38-BZ-1001', driver: 'Rajesh Kumar', status: 'In Transit', date: '2024-03-25', value: '15000', items: 'Electronics x 500', estDays: 2, manager: 'Sathish Kumar' },
  { id: 'b2', client: 'Flipkart', from: 'Mumbai', to: 'Delhi', vehicle: 'MH-12-PQ-4455', driver: 'Vikram Singh', status: 'Pending', date: '2024-03-26', value: '45000', items: 'Furniture x 200', estDays: 4, manager: 'Rahul Verma' },
  { id: 'b3', client: 'Reliance Retail', from: 'Hyderabad', to: 'Vijayawada', vehicle: 'Unassigned', driver: 'Unassigned', status: 'Scheduled', date: '2024-03-28', value: '12000', items: 'Groceries x 1000', estDays: 1, manager: 'Sathish Kumar' },
];

export const generateFuelData = (): FuelEntry[] => [
  { id: 1, vehicle: 'TN-38-BZ-1001', date: '2024-03-01', liters: 150, cost: 15000, station: 'Indian Oil, Chennai', credit: true },
  { id: 2, vehicle: 'KA-01-HG-9922', date: '2024-03-02', liters: 200, cost: 20000, station: 'Bharat Petroleum, Bangalore', credit: false },
  { id: 3, vehicle: 'MH-12-PQ-4455', date: '2024-03-03', liters: 120, cost: 12000, station: 'Shell, Mumbai', credit: true },
];