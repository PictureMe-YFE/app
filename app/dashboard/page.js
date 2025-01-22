import ButtonAccount from "@/components/ButtonAccount";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import Gallery from "@/components/Gallery";
import { getUserSlides } from "@/actions/qrCode.actions";
export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  const slides = await getUserSlides();


  return (
    <main className="min-h-screen  pb-24 bg-black antialiased ">
      <section className=" mx-auto ">
        <div className="p-8">
          <ButtonAccount />
        </div>
        <h1 className="px-8 text-3xl md:text-4xl font-extrabold text-white">Your memories</h1>
        <div className="px-4">
        <Gallery slides={slides} />
        </div>
      </section>
    </main>
  );
}
