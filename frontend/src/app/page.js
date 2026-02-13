"use client";

import Image from "next/image";
import creative1 from "@/images/creative1.jpg";
import commuter from "@/images/commuter.jpg";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <div className="pl-15 pr-15 pt-5 pb-10 bg-berce-ivory">
        <Image src={creative1} alt="Creative Image" className="rounded-xl" />
      </div>

      <div className="_marquee overflow-hidden w-full mt-10 mb-10">
        <div className="_movingTexts flex w-max">
          <h1 className="text-6xl text-berce-orange mr-20">#CarryTheMoment</h1>
          <h1 className="text-6xl text-berce-orange mr-20">#CarryTheMoment</h1>
          <h1 className="text-6xl text-berce-orange mr-20">#CarryTheMoment</h1>
          <h1 className="text-6xl text-berce-orange mr-20">#CarryTheMoment</h1>
          <h1 className="text-6xl text-berce-orange mr-20">#CarryTheMoment</h1>
          <h1 className="text-6xl text-berce-orange mr-20">#CarryTheMoment</h1>
        </div>
      </div>

      <div className="flex w-full h-150 bg-berce-ivory">
        <div className="w-1/2 flex flex-col justify-center text-center px-16">
          <p className="text-berce-black mb-6 text-2xl font-bold">
            Our products are crafted to support you every step of the way,
            ensuring that each moment, from the first step of your journey to
            the last, is cradled in style, durability, and purpose.
          </p>
          <div>
            <button
              onClick={() => router.push("/our-story")}
              className="font-bold w-fit text-berce-white bg-berce-black px-6 py-3 rounded-xl cursor-pointer hover:bg-berce-ivory hover:border-black hover:border-2 hover:text-berce-black">
              Read more...
            </button>
          </div>
        </div>

        <div className="relative w-1/2">
          <Image
            src={commuter}
            alt="Berce Image"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
