import playstore from "../assets/play.jpeg";
import iAppple from "../assets/apple.png";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      {/* ── 11. FOOTER ──────────────────────────────────── */}
      <footer className="bg-black">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Brand — mobile pe full width */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-white font-bold text-lg mb-2">CartSquare</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Premium fashion for every mood. Quality you can feel, prices
              you'll love.
            </p>
            <div className="flex gap-3 mt-3">
              {["Instagram", "Twitter", "Facebook"].map((s) => (
                <button
                  key={s}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Mobile pe 3 columns side by side — col-span-2 full width mein */}
          <div className="col-span-2 grid grid-cols-3 md:grid-cols-3 md:col-span-3 gap-4">
            {[
              {
                title: "Shop",
                links: ["New Arrivals", "Best Sellers", "Men", "Women", "Kids"],
              },
              {
                title: "Help",
                links: [
                  "Track Order",
                  "Returns",
                  "Size Guide",
                  "FAQs",
                  "Contact Us",
                ],
              },
              {
                title: "Company",
                links: [
                  "About Us",
                  "Careers",
                  "Press",
                  "Privacy Policy",
                  "Terms",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-white font-semibold text-sm mb-3">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-gray-400 text-xs hover:text-white transition-colors no-underline"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © 2025 CartSquare. All rights reserved.
          </p>
          <div className="flex gap-2">
            {["Visa", "Mastercard", "UPI", "RazorPay"].map((pay) => (
              <span
                key={pay}
                className="text-[10px] font-semibold text-gray-500 bg-gray-800 px-2 py-1 rounded"
              >
                {pay}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
