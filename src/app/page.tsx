import { Header } from "@/components/header";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <div className="max-w-5xl m-auto w-full px-4 ">
        <div className="rounded-md px-4  my-4 py-2 bg-black  font-bold  text-sm text-white">
          Click on Dashboard to Login! 🚀
        </div>
        <div className="min-h-[60vh] grid place-items-center rounded-lg px-6 py-10 bg-slate-100">
            <Link
              href={String('/dashboard')}
              className="font-medium text-base hover:underline hover:text-lg"
            >
              Visit Dashboard now!
            </Link>
          </div>
      </div>
    </main>
  );
}
