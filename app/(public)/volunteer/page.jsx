'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HandHeart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VolunteerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interests: '',
    availability: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = fetch('/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    toast.promise(promise, {
      loading: 'Submitting your application...',
      success: (res) => {
        if (res.status === 409) throw new Error('This email has already been registered.');
        if (!res.ok) throw new Error('Something went wrong.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          interests: '',
          availability: ''
        });
        return 'Thank you for your interest! We will be in touch soon.';
      },
      error: (err) => err.message,
      finally: () => setIsLoading(false),
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <HandHeart className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Join Our Volunteer Team
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Your time and skills can create meaningful change in our community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl">Volunteer Application</CardTitle>
                <CardDescription className="text-green-100">
                  Please fill out the form below to get started
                </CardDescription>
              </CardHeader>
            </div>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                      disabled={isLoading}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      disabled={isLoading}
                      className="bg-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    disabled={isLoading}
                    className="bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interests" className="text-gray-700">Areas of Interest</Label>
                  <Textarea 
                    id="interests" 
                    placeholder="e.g., Event planning, food drives, mentoring, fundraising..." 
                    value={formData.interests} 
                    onChange={handleChange} 
                    className="min-h-[100px] bg-white"
                    disabled={isLoading} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability" className="text-gray-700">Availability</Label>
                  <Textarea 
                    id="availability" 
                    placeholder="e.g., Weekends, weekday evenings, flexible schedule..." 
                    value={formData.availability} 
                    onChange={handleChange} 
                    className="min-h-[100px] bg-white"
                    disabled={isLoading} 
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full py-6 bg-green-600 hover:bg-green-700 text-lg font-medium transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500 text-center">
                  * Required fields. We respect your privacy and will never share your information.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <h3 className="text-lg font-medium text-gray-900">Have questions about volunteering?</h3>
          <p className="mt-2 text-gray-600">
            Email us at <a href="mailto:volunteer@example.org" className="text-green-600 hover:underline">volunteer@example.org</a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}