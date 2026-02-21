"use client";

export default function Spinner({ title = true, items = 6 }) {
  return (
    <section className="bg-[#f3f4f6] py-16">
      <div className="max-w-screen-2xl mx-auto px-6">
        
        {title && (
          <div className="h-8 w-64 bg-gray-300 rounded mb-12 animate-pulse"></div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[...Array(items)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse"
            >
              {/* Title */}
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>

              {/* Image */}
              <div className="h-56 bg-gray-200 w-full"></div>

              {/* Info */}
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                <div className="h-10 bg-gray-300 rounded-xl w-full"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Spinner */}
        <div className="flex justify-center mt-12">
          <div className="w-10 h-10 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </section>
  );
}