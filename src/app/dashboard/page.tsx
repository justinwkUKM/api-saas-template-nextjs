import {
  createCheckoutLink,
  createCustomerIfNull,
  hasSubscription,
  stripe,
} from "@/lib/stripe";
import Link from "next/link";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
const prisma = new PrismaClient();

export default async function Page() {
  const session = await getServerSession(authOptions);
  const customer = await createCustomerIfNull();
  const isSubscribed = await hasSubscription();
  const checkoutLink = await createCheckoutLink(String(customer));

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  const top10Recentlogs = await prisma.log.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      created: "desc",
    },
    take: 10,
  });

  let current_usage = 0;

  if (isSubscribed) {
    const subscriptions = await stripe.subscriptions.list({
      customer: String(user?.stripe_customer_id),
    });
    const invoice = await stripe.invoices.retrieveUpcoming({
      subscription: subscriptions.data.at(0)?.id,
    });

    current_usage = invoice.amount_due;
  }

  return (
    <main>
      {isSubscribed ? (
        <>
          <div className="flex flex-col gap-4">
            <div className="rounded-md px-4 py-2 bg-black  font-bold  text-lg text-white">
              Yeay! You have a subscription! 🚀
            </div>

            <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
              <p className="text-sm text-black px-6 py-4 font-bold">
                Current API Usage
              </p>
              <p className="text-sm font-mono text-zinc-800 px-6 py-4">
                {current_usage / 100}
                {/* because strip doesnt save decimals */}
              </p>
            </div>
            <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
              <p className="text-sm text-black px-6 py-4 font-bold">
                How to increment the Usage?
              </p>
              <p className="text-sm font-mono text-zinc-800 px-6 py-4">
                Goto{" "}
                <a
                  className="hover:underline"
                  href="http://localhost:3000/api/endpoint?api_key=apikey_"
                >
                  {" "}
                  this endpoint. If you provide the right api key, the usage
                  should increment everytime you hit the api endpoint.{" "}
                </a>
              </p>
            </div>

            <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
              <p className="text-sm text-black px-6 py-4 font-bold">API Key</p>
              <p className="text-sm font-mono text-zinc-800 px-6 py-4">
                {user?.api_key}
              </p>
            </div>


            <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
              <p className="text-sm text-black px-6 py-4 font-bold">
                Log Events
              </p>
              {top10Recentlogs.map((item, index) => (
                <div className="flex items-center gap-4" key={index}>
                  <p className="text-sm font-mono text-zinc-800 px-6 py-4">
                    {item.method}
                  </p>
                  <p className="text-sm font-mono text-zinc-800 px-6 py-4">
                    {item.status}
                  </p>
                  <p className="text-sm font-mono text-zinc-800 px-6 py-4">
                    {item.created.toUTCString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[60vh] grid place-items-center rounded-lg px-6 py-10 bg-slate-100">
            <Link
              href={String(checkoutLink)}
              className="font-medium text-base hover:underline"
            >
              You do not have any subscription, checkout now!
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
