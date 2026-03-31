import Calendar from "./Calendar";

function ValidatorDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-stone-500/20 rounded-3xl blur-2xl opacity-20 pointer-events-none"></div>
        <div className="relative">
          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default ValidatorDashboard;