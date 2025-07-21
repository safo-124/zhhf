import Link from "next/link";
import { CircleUser, Home, Package, HandHeart, CalendarClock, Mail, Users, Newspaper, Target, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// This is a Server Component, so we can check the session here.
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  // If no session is found, redirect user to the login page.
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <HandHeart className="h-6 w-6" />
              <span className="">ZHHF Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Donations
              </Link>
              <Link
                href="/dashboard/events"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <CalendarClock className="h-4 w-4" />
                Events
              </Link>
              <Link
                href="/dashboard/subscribers"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                Subscribers
              </Link>
              <Link
  href="/dashboard/blog" // Add this link
  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
>
  <Newspaper className="h-4 w-4" /> 
  Blog
</Link>
<Link
  href="/dashboard/campaigns" // Add this link
  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
>
  <Target className="h-4 w-4" /> {/* You'll need to import Target from lucide-react */}
  Campaigns
</Link>
<Link
  href="/dashboard/gallery" // Add this link
  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
>
  <Image className="h-4 w-4" /> {/* You'll need to import Target from lucide-react */}
  Gallery
</Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
           {/* We can add a mobile sidebar toggle here later */}
           <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Donations</h1>
           </div>
           <Button variant="secondary" size="icon" className="rounded-full">
             <CircleUser className="h-5 w-5" />
             <span className="sr-only">Toggle user menu</span>
           </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}