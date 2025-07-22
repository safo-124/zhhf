import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, HandHeart, Calendar, Target } from 'lucide-react';

async function getHomepageContent() {
  const [latestPost, nextEvent, latestCampaign] = await Promise.all([
    prisma.post.findFirst({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.event.findFirst({
      where: { eventDate: { gte: new Date() } },
      orderBy: { eventDate: 'asc' },
    }),
    prisma.campaign.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return { latestPost, nextEvent, latestCampaign };
}

export default async function Home() {
  const { latestPost, nextEvent, latestCampaign } = await getHomepageContent();

  return (
    <main className="bg-white text-slate-800">
      
      {/* Section 1: Hero */}
      <section className="relative w-full h-screen flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-blue-950/70 z-10" />
        <Image 
          src="/hero-background.jpg" // Add a high-quality photo to your /public folder
          alt="Community support" 
          fill 
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 flex flex-col items-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Empowering Our Community, Together.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-blue-100">
            We provide essential support and create opportunities for those in need, building a stronger future for everyone.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-base px-8 py-6 rounded-md shadow-lg">
                Donate Now
              </Button>
            </Link>
            <Link href="/volunteer">
              <Button size="lg" variant="outline" className="text-black border-white hover:bg-white hover:text-blue-950 text-base px-8 py-6 rounded-md shadow-lg">
                Get Involved
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Our Mission */}
      <section className="w-full py-20 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-blue-950">
              Our Mission
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Zion Helping Hand Foundation is a non-profit organization dedicated to providing immediate and sustainable support to vulnerable individuals and families. We believe in the power of community and direct action to create lasting change.
            </p>
            <div className="mt-8">
                <Link href="/about">
                    <Button variant="outline" className="text-blue-900 border-blue-900 hover:bg-blue-50 hover:text-blue-900">
                        Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
      </section>

      {/* Section 3: Latest Updates */}
      <section className="w-full py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-blue-950">
              What's New
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPost && (
              <Link href={`/blog/${latestPost.slug}`} className="group block space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image src={latestPost.imageUrl || '/placeholder.svg'} alt={latestPost.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-700">Latest News</p>
                  <h3 className="text-xl font-bold mt-1 text-blue-950 group-hover:text-green-700 transition-colors">{latestPost.title}</h3>
                </div>
              </Link>
            )}
             {nextEvent && (
              <Link href="/events" className="group block space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image src={nextEvent.imageUrl || '/placeholder.svg'} alt={nextEvent.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-700">Upcoming Event</p>
                  <h3 className="text-xl font-bold mt-1 text-blue-950 group-hover:text-green-700 transition-colors">{nextEvent.title}</h3>
                </div>
              </Link>
            )}
             {latestCampaign && (
              <Link href={`/campaigns/${latestCampaign.id}`} className="group block space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
                  <Target className="h-12 w-12 text-slate-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-700">Featured Campaign</p>
                  <h3 className="text-xl font-bold mt-1 text-blue-950 group-hover:text-green-700 transition-colors">{latestCampaign.title}</h3>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Section 4: Join the Cause */}
      <section className="relative w-full py-20 md:py-32 text-center text-white">
        <div className="absolute inset-0 bg-blue-950/80 z-10" />
        <Image 
          src="/hero-background.jpg" // You can reuse the hero image or use a different one
          alt="Community" 
          fill 
          className="object-cover"
        />
        <div className="relative z-20 container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Join Our Mission
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100">
            Your support is vital. Help us continue our work and make a lasting impact.
          </p>
          <div className="mt-8">
            <Link href="/donate">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-base px-8 py-6 rounded-md shadow-lg">
                Donate Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}