import { MainContentServices } from "@/components/services/MainServices";

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="w-full h-96 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
        <div className="text-center relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            Professional Services
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            Building Tomorrow's Web Today
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        <MainContentServices />
      </div>
    </div>
  );
}
