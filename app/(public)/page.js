import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, MoveDown, HeartHandshake, Calendar, PenSquare, Megaphone } from 'lucide-react';
import { AnimatedSection } from '@/components/animated-section';
import { GallerySlideshow } from '@/components/public/gallery-slideshow';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

async function getHomepageContent() {
  const [posts, events, campaignsData, stories, galleryImages] = await Promise.all([
    prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3, select: { id: true, title: true, slug: true, imageUrl: true, createdAt: true } }),
    prisma.event.findMany({ where: { eventDate: { gte: new Date() } }, orderBy: { eventDate: 'asc' }, take: 2, select: { id: true, title: true, description: true, imageUrl: true, eventDate: true } }),
    prisma.campaign.findMany({ 
      where: { isActive: true }, 
      orderBy: { createdAt: 'desc' }, 
      take: 2, 
      select: { 
        id: true, 
        title: true, 
        description: true, 
        goalAmount: true, 
        createdAt: true,
        donations: {
          where: { donationType: 'Money', amount: { not: null } },
          select: { amount: true }
        }
      } 
    }),
    prisma.story.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 2, select: { id: true, title: true, content: true, createdAt: true } }),
    prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
  ]);

  // Process campaigns to calculate total raised
  const campaigns = campaignsData.map(campaign => {
    const totalRaised = campaign.donations.reduce((sum, donation) => sum + Number(donation.amount || 0), 0);
    return { ...campaign, totalRaised };
  });

  const feedItems = [
    ...posts.map(item => ({ ...item, type: 'Blog', date: item.createdAt })),
    ...events.map(item => ({ ...item, type: 'Event', date: item.eventDate })),
    ...campaigns.map(item => ({ ...item, type: 'Campaign', date: item.createdAt })),
    ...stories.map(item => ({ ...item, type: 'Story', date: item.createdAt })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return { feedItems, galleryImages };
}

const typeIcons = {
  Blog: <PenSquare className="h-5 w-5" />,
  Event: <Calendar className="h-5 w-5" />,
  Campaign: <Megaphone className="h-5 w-5" />,
  Story: <HeartHandshake className="h-5 w-5" />,
};

export default async function Home() {
  const { feedItems, galleryImages } = await getHomepageContent();

  const cardColors = {
    Blog: "bg-blue-50 border-blue-200",
    Event: "bg-green-50 border-green-200",
    Campaign: "bg-red-50 border-red-200",
    Story: "bg-amber-50 border-amber-200",
  };

  return (
    <main className="bg-white text-slate-800">
      {/* Modern Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />
        <Image 
          src="/hero-background.jpg" 
          alt="Community helping hands" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="relative z-20 container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-lg">
                Building <span className="text-green-400">Hope</span>, Creating <span className="text-green-400">Change</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                Together we can make a difference in the lives of those who need it most.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/donate">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-105">
                    Donate Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 px-8 py-6 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-105">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-10 z-20 animate-bounce">
          <MoveDown className="h-8 w-8 text-white/80" />
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="w-full py-16 bg-gradient-to-r from-blue-900 to-green-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedSection>
              <div className="p-6">
                <h3 className="text-4xl font-bold mb-2">250+</h3>
                <p className="text-sm uppercase tracking-wider">Families Helped</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="p-6">
                <h3 className="text-4xl font-bold mb-2">50+</h3>
                <p className="text-sm uppercase tracking-wider">Events Held</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <div className="p-6">
                <h3 className="text-4xl font-bold mb-2">$1M+</h3>
                <p className="text-sm uppercase tracking-wider">Raised</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.6}>
              <div className="p-6">
                <h3 className="text-4xl font-bold mb-2">100+</h3>
                <p className="text-sm uppercase tracking-wider">Volunteers</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Latest Activities Section */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedSection>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                Our Latest <span className="text-green-600">Activities</span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                Stay updated with our recent work and upcoming events
              </p>
            </AnimatedSection>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {feedItems.map((item, index) => {
              const gridClass = index === 0 ? "md:col-span-2" : "";
              const href = item.type === 'Blog' ? `/blog/${item.slug}` : `/${item.type.toLowerCase()}s/${item.id}`;

              return (
                <AnimatedSection key={`${item.type}-${item.id}`} className={gridClass}>
                  <Link href={href} className={`group block h-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${cardColors[item.type]}`}>
                    {item.imageUrl && (
                      <div className="relative aspect-video w-full">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-full bg-white/80">
                          {typeIcons[item.type]}
                        </div>
                        <Badge variant="outline" className="capitalize">{item.type}</Badge>
                        <span className="text-sm text-gray-500 ml-auto">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                        {item.title}
                      </h3>
                      
                      {item.type === 'Campaign' ? (
                        <div className="mt-4 space-y-3">
                          <Progress value={(item.totalRaised / Number(item.goalAmount)) * 100} className="h-2" />
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">${item.totalRaised.toLocaleString()}</span>
                            <span className="text-gray-500">Goal: ${Number(item.goalAmount).toLocaleString()}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-600 line-clamp-2 mb-4">
                          {item.description || item.content}
                        </p>
                      )}
                      
                      <div className="flex items-center text-green-600 font-medium group-hover:underline">
                        Read more
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
          
          <AnimatedSection className="mt-12 text-center">
            <Link href="/activities">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-6">
                View All Activities
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="w-full py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <AnimatedSection>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                  Moments of <span className="text-green-600">Impact</span>
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                  See the difference we're making together
                </p>
              </AnimatedSection>
            </div>
            
            <AnimatedSection>
              <GallerySlideshow images={galleryImages} />
            </AnimatedSection>
            
            <AnimatedSection className="mt-12 text-center">
              <Link href="/gallery">
                <Button variant="ghost" className="text-green-600 hover:bg-green-50 px-8 py-6">
                  View Full Gallery
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="w-full py-20 bg-gradient-to-r from-blue-800 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="max-w-2xl mx-auto text-lg mb-8">
              Your support can change lives. Join us in our mission today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate">
                <Button size="lg" className="bg-white text-green-800 hover:bg-gray-100 px-8 py-6 rounded-full font-bold shadow-lg">
                  Donate Now
                </Button>
              </Link>
              <Link href="/volunteer">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 px-8 py-6 rounded-full font-bold shadow-lg">
                  Volunteer
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}