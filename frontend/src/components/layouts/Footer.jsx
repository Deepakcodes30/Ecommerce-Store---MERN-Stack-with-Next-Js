"use client";

import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <div className="tracking-wide leading-7 grid grid-cols-3 text-berce-white bg-berce-black p-15 gap-20">
      <div className="flex flex-col">
        <p className="text-xl font-bold">#CarryTheMoment</p>
        <br />
        <p>
          Life isn’t just about destinations; it’s about the journey itself—the
          moments in between. At BERCE, we understand that every step you take
          has a story to tell. Some stories are about a new career move, while
          others are about spontaneous weekend trips, city explorations, or
          peaceful mornings. BERCE is designed to cradle these moments, to
          seamlessly blend utility with timeless elegance, and to give you space
          to focus on your story.
        </p>
        <br />
        <p>
          At BERCE, we don’t just create bags; we create companions for the
          memories you’ll cherish. Whether you're navigating the city, boarding
          a plane, or taking a stroll through the unknown, know this: you always
          #CarryTheMoment.
        </p>
      </div>

      <div className="flex flex-col">
        <p className="text-xl font-bold">Quick Links</p>
        <br />
        <ul className="flex flex-col">
          <Link className="hover:underline" href="/shop-all">
            Shop All
          </Link>
          <Link className="hover:underline" href="/our-story">
            Our Story
          </Link>
          <Link className="hover:underline" href="/shipping-delivery-policy">
            Shipping and Delivery policy
          </Link>
          <Link className="hover:underline" href="/returns-exchange-policy">
            Returns & Exchange Policy
          </Link>
          <Link className="hover:underline" href="/privacy-policy">
            Privacy Policy
          </Link>
          <Link className="hover:underline" href="/terms-conditions">
            Terms & Conditions
          </Link>
        </ul>
      </div>

      <div className="flex flex-col">
        <p className="text-xl font-bold">Contact Us</p>
        <br />
        <ul>
          <li>Office Timings - Monday to Friday, 10 am - 5 pm​</li>
          <li>Email - support@berce.co</li>
          <li>Phone No. - +91 99678 17085</li>
          <li>
            Address - B-303, Lalbaug Cha Raja, Lalbaug Market, Maharashtra - 400
            012
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
