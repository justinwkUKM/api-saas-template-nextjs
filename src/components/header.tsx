import { isLoggedIn } from "@/lib/auth";
import Link from "next/link";

export async function Header() {
  const isLogIn = await isLoggedIn()
  return (
    <nav className="max-w-5xl m-auto w-full px-4">
      <div className="flex items-center gap-8 justify-between py-4">
        <Link
          href={"/"}
          className="text-xl font-semibold text-black hover:opacity-90 hover:font-bold"
        >
          api-saas-template-nextjs-2023
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/#features"
            className="font-medium text-sm text-black hover:opacity-90 hover:font-bold"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="font-medium text-sm text-black hover:opacity-90 hover:font-bold"
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="font-medium text-sm underline px-4 py-2 rounded-lg hover:opacity-90 hover:font-bold"
          >
            Dashboard
          </Link>
          {!isLogIn ?   
          <Link
          href="/api/auth/signin"
          className="font-medium text-sm text-black hover:opacity-90 hover:font-bold"
        >
          Signin
        </Link>   : 
          <Link
          href="/api/auth/signout"
          className="font-medium text-sm text-black hover:opacity-90 hover:font-bold"
        >
          Signout
        </Link> 
          }
        </div>
      </div>
    </nav>
  );
}