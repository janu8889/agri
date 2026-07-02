function ContactSection({ LocationIcon, ClockIcon, PhoneIcon, ExternalIcon }) {
  return (
    <section className="py-20 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        <div
          className="grid md:grid-cols-2 gap-10"
          style={{ maxWidth: 1100, margin: "0 auto" }}
        >

          {/* LEFT SIDE */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 md:p-10">

            <h3 className="text-[#1a1a1a] text-[28px] md:text-[34px] font-bold mb-6">
              Visit Our Sales Yard
            </h3>

            <p className="text-[#555] mb-10 leading-relaxed text-[16px] md:text-[18px]">
              Experience our inventory in person. Our sales yard is open by
              appointment, ensuring personalized attention for every visitor.
            </p>

            {/* ITEM 1 */}
            <div className="flex items-start gap-4 mb-8">
              <div className="text-[#c9a227] mt-1">
                <LocationIcon className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-[#1a1a1a] font-semibold mb-1">
                  Location
                </h4>

                <p className="text-[#555] leading-relaxed">
                  715 W Coplin St
                  <br />
                  Okemah, OK 74859
                </p>
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="flex items-start gap-4 mb-8">
              <div className="text-[#c9a227] mt-1">
                <ClockIcon className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-[#1a1a1a] font-semibold mb-1">
                  Hours
                </h4>

                <p className="text-[#555]">
                  Monday to Friday: 9AM - 5PM
                </p>
              </div>
            </div>

            {/* ITEM 3 */}
            <div className="flex items-start gap-4">
              <div className="text-[#c9a227] mt-1">
                <PhoneIcon className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-[#1a1a1a] font-semibold mb-1">
                  Call Us
                </h4>

                <p>
                  <a
                    href="tel:"
                    className="text-[#555] hover:text-[#c9a227] transition-colors"
                  >
                    
                  </a>
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-10 flex items-center justify-center">

            <div className="text-center">

              <div className="flex justify-center text-[#c9a227] mb-6">
                <LocationIcon className="w-12 h-12" />
              </div>

              <p className="text-[#555] mb-8">
                715 W Coplin St
                <br />
                Okemah, OK 74859
              </p>

              <a
                href="https://www.google.com/maps/place/S+%26+W+Equipment/@35.4193309,-96.3090099,936m/data=!3m2!1e3!4b1!4m6!3m5!1s0x87b40c924158515d:0xff7b19af7ed85bad!8m2!3d35.4193309!4d-96.3090099!16s%2Fg%2F1tj89ylf?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#e6c65a] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#d4b44f] transition-all duration-300"
              >
                Get Directions
                <ExternalIcon className="w-4 h-4" />
              </a>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default ContactSection;