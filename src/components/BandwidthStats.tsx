'use client';

import { useEffect, useState } from 'react';

interface BandaData {
  success: boolean;
  consumedGB: number;
  limitGB: number;
  month: string;
}

export default function BandwidthStats() {
  const [data, setData] = useState<BandaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    fetch('/api/banda')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
        // Delay for the animation effect
        setTimeout(() => {
          const percentage = Math.min((data.consumedGB / data.limitGB) * 100, 100);
          setAnimatedWidth(percentage);
        }, 100);
      })
      .catch((err) => {
        console.error('Error fetching bandwidth stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-md p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 animate-pulse">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3 mb-6"></div>
        <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 mb-6"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full w-full"></div>
      </div>
    );
  }

  if (!data || !data.success) {
    return (
      <div className="text-red-500 text-sm font-medium">
        Error al cargar los datos de ancho de banda.
      </div>
    );
  }

  const isWarning = data.consumedGB >= 80;

  // Colors and gradients
  const barGradient = isWarning
    ? 'from-amber-400 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
    : 'from-emerald-400 to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]';

  const textColor = isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';

  return (
    <div className="w-auto max-w-md group p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-none transition-all duration-500 hover:border-zinc-300 dark:hover:border-zinc-700">
      <div className="flex flex-col gap-1 mb-6">
        <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          Estadísticas de Tráfico
        </p>
        <h2 className="text-zinc-900 dark:text-zinc-100 text-lg font-semibold tracking-tight leading-snug">
          GB consumidas durante el mes de: <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 capitalize">{data.month}</span>
        </h2>
      </div>

      <div className="flex items-baseline gap-2 mb-8">
        <span className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
          {data.consumedGB.toFixed(2)}
        </span>
        <span className="text-zinc-400 dark:text-zinc-500 text-lg font-medium">/ {data.limitGB} GB</span>
      </div>

      <div className="space-y-4">
        <div className="relative w-full h-5 bg-zinc-100 dark:bg-zinc-900 rounded-full p-1 border border-zinc-200/50 dark:border-zinc-800/50">
          <div
            className={`h-full transition-all duration-1000 ease-out rounded-full bg-gradient-to-r ${barGradient}`}
            style={{ width: `${animatedWidth}%` }}
          >
            {animatedWidth > 15 && (
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center px-1">
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${textColor}`}>
              {animatedWidth.toFixed(1)}% Utilizado
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
              Consumo acumulado
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {(data.limitGB - data.consumedGB).toFixed(2)} GB
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
              Disponibles
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
