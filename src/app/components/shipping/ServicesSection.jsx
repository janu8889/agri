function ServicesSection({ services, ServiceIcon, CheckIcon }) {
  return (
    <section className="py-20 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#c9a227] font-semibold uppercase tracking-[3px] text-sm">
            Our Services
          </span>

          <h2 className="mt-3 text-[#1a1a1a] text-[32px] md:text-[42px] font-bold">
            Transport Options
          </h2>

          <div className="w-24 h-[3px] bg-[#c9a227] mx-auto mt-5 mb-5" />

          <p className="text-[#555] text-[16px] md:text-[18px] max-w-2xl mx-auto">
            Choose the shipping method that best fits your needs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="
                bg-white
                border border-[#e5e7eb]
                rounded-2xl
                overflow-hidden
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-500
                flex
                flex-col
              "
            >
              {/* TOP */}
              <div className="p-8 border-b border-[#f0f0f0] text-center">

                <div
                  className="
                    w-16 h-16
                    mx-auto mb-5
                    rounded-full
                    bg-[#c9a227]/10
                    flex items-center justify-center
                    text-[#c9a227]
                  "
                >
                  <ServiceIcon type={service.icon} />
                </div>

                <h3 className="text-[#1a1a1a] text-2xl font-bold mb-2">
                  {service.title}
                </h3>

                <p className="text-[#777]">
                  {service.subtitle}
                </p>
              </div>

              {/* CONTENT */}
              <div className="p-8 flex flex-col flex-grow">

                <ul className="space-y-4 mb-8 flex-grow">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="
                        flex
                        items-start
                        gap-3
                        text-[#555]
                        pb-4
                        border-b
                        border-[#f0f0f0]
                        last:border-b-0
                        last:pb-0
                      "
                    >
                      <span className="text-[#c9a227] flex-shrink-0 mt-1">
                        <CheckIcon />
                      </span>

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* PRICE */}
                <div className="text-center mb-6">
                  <p className="text-[#c9a227] text-2xl font-bold">
                    {service.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ServicesSection;