import React from "react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wide">
          Our Story
        </h1>
        <p className="text-xl text-gray-600 italic">#CarryTheMoment</p>
      </div>

      {/* Main Content */}
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <p className="text-lg">
          At BERCE, we believe every journey begins with a story. Whether you're
          chasing dreams, exploring horizons, or taking a simple step toward
          something new—there's magic in every destination. Derived from the
          French word <span className="italic">Bercer</span> (to cradle), BERCE
          represents comfort, elegance, and care. We are here to cradle your
          moments, to turn every journey into a story worth remembering.
        </p>

        <div className="border-l-4 border-gray-300 pl-6 py-4 bg-gray-50">
          <p className="text-lg italic text-gray-800">
            "Life isn't just about destinations; it's about the journey
            itself—the moments in between."
          </p>
        </div>

        <p className="text-lg">
          At BERCE, we understand that every step you take has a story to tell.
          Some stories are about a new career move, while others are about
          spontaneous weekend trips, city explorations, or peaceful mornings.
          BERCE is designed to cradle these moments, to seamlessly blend utility
          with timeless elegance, and to give you space to focus on your story.
        </p>

        <p className="text-lg">
          At BERCE, we don't just create bags; we create companions for the
          memories you'll cherish. Whether you're navigating the city, boarding
          a plane, or taking a stroll through the unknown, know this: you always{" "}
          <span className="font-semibold">#CarryTheMoment</span>.
        </p>
      </div>

      {/* Philosophy Section */}
      <div className="bg-gray-50 p-8 rounded-lg space-y-6">
        <h2 className="text-2xl font-serif text-center">Our Philosophy</h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-semibold text-lg mb-2">Comfort</h3>
            <p className="text-gray-600">
              Every product is designed to cradle your essentials with care
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Elegance</h3>
            <p className="text-gray-600">
              Timeless design that complements every journey
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Care</h3>
            <p className="text-gray-600">
              Crafted with attention to detail and quality
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-8">
        <p className="text-xl text-gray-700 mb-6">Ready to start your story?</p>
        <a
          href="/products"
          className="inline-block bg-black text-white px-8 py-3
          rounded hover:bg-gray-800 transition">
          Explore Our Collection
        </a>
      </div>
    </div>
  );
}
