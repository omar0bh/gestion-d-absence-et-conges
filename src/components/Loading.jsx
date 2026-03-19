function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-3xl shadow-lg mt-8">
      <div className="w-12 h-12 border-4 border-zinc-700/50 border-t-[#8b7355] rounded-full animate-spin mb-4 shadow-sm"></div>
      <p className="text-stone-300 font-semibold tracking-wide drop-shadow-sm">Loading data...</p>
    </div>
  );
}

export default Loading;