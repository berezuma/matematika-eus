export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-500 font-medium">Kargatzen...</p>
    </div>
  );
}
