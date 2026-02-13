import Header from "../components/layouts/Header.jsx";
import Details from "@/components/layouts/Details.jsx";
import Footer from "../components/layouts/Footer.jsx";
import "./globals.css";

export const metadata = {
  title: {
    template: "%s | Berce",
    default: "Berce | Bags & Luggage",
  },
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
        <Details />
        <Footer />
      </body>
    </html>
  );
}
