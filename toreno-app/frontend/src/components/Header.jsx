export default function Header() {
  return (
    <header className="bg-toreno-green shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-white text-3xl font-bold">🎂</div>
          <h1 className="text-2xl font-bold text-white">Toreno Pastelería</h1>
        </div>
        
        <button className="bg-white text-toreno-green px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
          Acceder
        </button>
      </div>
    </header>
  );
}