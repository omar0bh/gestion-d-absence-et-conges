function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-10 p-8 glass-card">
      <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
        {title}
      </h1>
      {subtitle && (
        <div className="flex items-center gap-2">
          <div className="h-[2px] w-8 bg-amber-500/50 rounded-full"></div>
          <p className="text-sm font-medium text-stone-400 uppercase tracking-[0.15em]">
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}

export default PageHeader;