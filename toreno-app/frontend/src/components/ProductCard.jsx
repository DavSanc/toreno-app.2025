export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      <div className="h-48 bg-gray-200 flex items-center justify-center text-6xl">
        🎂
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-toreno-green">
            ${product.price?.toLocaleString()}
          </span>
          <button className="bg-toreno-green text-white px-4 py-2 rounded-lg hover:bg-toreno-dark transition">
            Pedir
          </button>
        </div>
      </div>
    </div>
  );
}