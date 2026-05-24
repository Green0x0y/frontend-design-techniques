import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Zap, Calendar } from 'lucide-react';
import { energyData } from '../data/mockData';

export function Statistics() {
  const totalEnergy = energyData.reduce((acc, curr) => acc + curr.energia, 0);
  const avgDaily = totalEnergy / energyData.length;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Statystyki i energia</h1>
        <p className="text-slate-600">Monitoruj zużycie energii w swoim domu</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Całkowite zużycie</p>
          <p className="text-3xl font-bold text-slate-900">{totalEnergy.toFixed(1)} kWh</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Średnio dziennie</p>
          <p className="text-3xl font-bold text-slate-900">{avgDaily.toFixed(1)} kWh</p>
        </div>
      </div>

      {/* Energy Consumption Bar Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Zużycie energii w ciągu tygodnia</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={energyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="energia" fill="#3b82f6" name="Energia (kWh)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
