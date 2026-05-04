import Image from "next/image";
import BandwidthStats from "../components/BandwidthStats";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black selection:bg-emerald-500/30">
      <main className="flex flex-col w-full max-w-5xl items-center justify-center py-20 px-6 sm:px-12">
        <div className="mb-12">
          <Image
            className="dark:invert opacity-80"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={24}
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-12 w-full">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-black dark:text-white">
              Panel de control del servidor <span className="text-emerald-500">Metricas</span>
            </h1>
            <p className="max-w-xl text-lg text-zinc-500 dark:text-zinc-400 font-medium text-center mx-auto">
              Monitorización en tiempo real del consumo de banda ancha del servidor.
            </p>
          </div>

          <BandwidthStats />
        </div>
      </main>

    </div>
  );
}
