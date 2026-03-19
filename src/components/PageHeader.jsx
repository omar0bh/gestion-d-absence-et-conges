function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8 p-6 bg-zinc-950/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-stone-100 drop-shadow-md mb-2">{title}</h1>
      {subtitle && (
        <p className="text-sm font-medium text-stone-300 bg-zinc-900/60 inline-block px-3 py-1.5 rounded-lg border border-zinc-700/50 shadow-inner">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default PageHeader;