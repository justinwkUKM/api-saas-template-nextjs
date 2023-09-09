import { Header } from "@/components/header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { createCheckoutLink, createCustomerIfNull, hasSubscription, stripe } from "@/lib/stripe";
import { mustBeLoggedIn } from "@/lib/auth";


stripe

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await mustBeLoggedIn()
  const customer = await createCustomerIfNull()
  const hasSub = await hasSubscription()
  console.log(hasSub ? "Has":"Has Not Subscription")
  console.log(customer)
  const checkoutLink = await createCheckoutLink(String(customer))
  console.log(checkoutLink)
  return (
    <div>
      <Header />
      <div className="max-w-5xl m-auto w-full px-4">{children}</div>
    </div>
  );
}
