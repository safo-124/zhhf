'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DonatePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [donationType, setDonationType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!donationType) {
      toast.error("Please select a donation type.");
      return;
    }
    setIsLoading(true);

    const promise = fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, donation_type: donationType }),
    });

    toast.promise(promise, {
      loading: 'Submitting your donation...',
      success: (res) => {
        if (!res.ok) {
          throw new Error('Server responded with an error.');
        }
        // Reset form on success
        setName('');
        setEmail('');
        setPhone('');
        setDonationType('');
        setIsLoading(false);
        return "Thank you! Your donation has been recorded. 🙏";
      },
      error: (err) => {
        setIsLoading(false);
        return 'Something went wrong. Please try again.';
      },
    });
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Make a Donation</CardTitle>
          <CardDescription>
            Your generous support helps us make a meaningful difference in our community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone / WhatsApp</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label>Donation Type</Label>
              <Select onValueChange={setDonationType} value={donationType} required disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Money">Money</SelectItem>
                  <SelectItem value="Food">Food Items</SelectItem>
                  <SelectItem value="Clothes">Clothing</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Donation'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}