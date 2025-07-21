import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, HandHeart, Target } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <main className="bg-gray-50/50">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-gray-50 to-gray-200 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            About Zion Helping Hand Foundation
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Learn about our journey, our mission, and the dedicated team working to make a difference in our community.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg" // Replace with a real image of the team or an event
              alt="ZHHF Team"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              [**REPLACE THIS TEXT**] Zion Helping Hand Foundation was founded in [Year] with a simple yet powerful goal: to extend a helping hand to those in need within our community. It all started when a small group of friends witnessed the struggles faced by local families and decided to take action. From humble beginnings organizing small food drives, we have grown into a registered foundation, yet our core values of compassion, community, and direct impact remain unchanged.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Every donation, every volunteer hour, and every event is a step towards building a stronger, more supportive community for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Target className="h-8 w-8 text-primary" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  [**REPLACE THIS TEXT**] To provide immediate and sustainable support to vulnerable individuals and families through the provision of food, clothing, and financial aid, fostering a community of care and mutual respect.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <HandHeart className="h-8 w-8 text-primary" />
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  [**REPLACE THIS TEXT**] We envision a future where every member of our community has the resources and support they need to thrive, free from the burdens of poverty and hardship.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}