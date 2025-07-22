import Link from "next/link";
import { CircleUser, Home, Package, HandHeart, CalendarClock, Mail, Users, Newspaper, Target, BookHeart, HeartHandshake } from "lucide-react";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import { DashboardHeader } from "@/components/dashboard/dashboard-header"; // Import the new header

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

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
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"><Package className="h-4 w-4" />Donations</Link>
              <Link href="/dashboard/campaigns" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"><Target className="h-4 w-4" />Campaigns</Link>
              <Link href="/dashboard/events" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"><CalendarClock className="h-4 w-4" />Events</Link>
              <Link href="/dashboard/blog" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"><Newspaper className="h-4 w-4" />Blog</Link>
              <Link href="/dashboard/stories" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"><BookHeart className="h-4 w-4" />Stories</Link>
              <Link href="/dashboard/subscribers" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"><Mail className="h-4 w-4" />Subscribers</Link>
              <Link href="/dashboard/volunteers" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"><HeartHandshake className="h-4 w-4" />Volunteers</Link>
              <Link href="/dashboard/users" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"><Users className="h-4 w-4" />Users</Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {/* Use the new interactive header component, passing the user data */}
        <DashboardHeader user={session.user} />

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}