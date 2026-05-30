function ProcessSection({ processSteps }) {
  return (
    <section className="py-20 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#c9a227] font-semibold uppercase tracking-[3px] text-sm">
            The Process
          </span>

          <h2 className="mt-3 text-[#1a1a1a] text-[32px] md:text-[42px] font-bold">
            How It Works
          </h2>

          <div className="w-24 h-[3px] bg-[#c9a227] mx-auto mt-5" />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {processSteps.map(([number, title, text]) => (
            <div
              key={title}
              className="
                bg-white
                border border-[#e5e7eb]
                rounded-2xl
                p-8
                text-center
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-500
              "
            >
              {/* Number */}
              <div
                className="
                  w-16 h-16
                  mx-auto mb-6
                  rounded-full
                  border-2 border-[#c9a227]
                  flex items-center justify-center
                  text-[#c9a227]
                  text-2xl
                  font-bold
                "
              >
                {number}
              </div>

              <h4 className="text-[#1a1a1a] text-xl font-semibold mb-3">
                {title}
              </h4>

              <p className="text-[#555] leading-relaxed text-[15px]">
                {text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ProcessSection;