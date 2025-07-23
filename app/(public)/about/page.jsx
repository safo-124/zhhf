import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, HandHeart, Target, Heart, HandCoins, Globe } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[50vh] flex items-center justify-center text-center bg-gradient-to-br from-blue-900 to-green-800">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <Image
          src="/about-hero.jpg"
          alt="Community helping hands"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            About Zion Helping Hand Foundation
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-200">
            Our journey, mission, and the dedicated team working to make a difference in our community.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/about-story.jpg"
              alt="ZHHF Team in action"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Zion Helping Hand Foundation was founded in [Year] with a simple yet powerful goal: to extend a helping hand to those in need within our community. It all started when a small group of friends witnessed the struggles faced by local families and decided to take action.
              </p>
              <p>
                From humble beginnings organizing small food drives, we have grown into a registered foundation, yet our core values of compassion, community, and direct impact remain unchanged.
              </p>
              <p>
                Every donation, every volunteer hour, and every event is a step towards building a stronger, more supportive community for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            The principles that guide everything we do
          </p>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="h-8 w-8 text-red-500" />,
                title: "Compassion",
                description: "We approach every person and situation with empathy and understanding."
              },
              {
                icon: <HandCoins className="h-8 w-8 text-blue-500" />,
                title: "Community",
                description: "We believe in the power of people coming together to create change."
              },
              {
                icon: <Globe className="h-8 w-8 text-green-500" />,
                title: "Impact",
                description: "We measure our success by the tangible difference we make in people's lives."
              }
            ].map((value, index) => (
              <Card key={index} className="h-full bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <Card className="h-full border-blue-200 bg-blue-50 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-900">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                To provide immediate and sustainable support to vulnerable individuals and families through the provision of food, clothing, and financial aid, fostering a community of care and mutual respect.
              </p>
            </CardContent>
          </Card>
          
          <Card className="h-full border-green-200 bg-green-50 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <HandHeart className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-900">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We envision a future where every member of our community has the resources and support they need to thrive, free from the burdens of poverty and hardship.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-800 to-green-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="max-w-2xl mx-auto text-xl mb-8 text-blue-100">
            Join us in our mission to create lasting change in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/donate" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-800 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Donate Now
            </a>
            <a 
              href="/volunteer" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              Volunteer
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}