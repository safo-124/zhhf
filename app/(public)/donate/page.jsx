'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function DonationForm() {
  const searchParams = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [donationType, setDonationType] = useState('');
  const [amount, setAmount] = useState(''); // State for the amount
  const [selectedCampaignId, setSelectedCampaignId] = useState(searchParams.get('campaignId') || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCampaigns() {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.filter(c => c.isActive));
      }
    }
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSend = {
      name, email, phone,
      donation_type: donationType,
      amount: donationType === 'Money' ? amount : null,
    };

    if (selectedCampaignId && selectedCampaignId !== 'general') {
      dataToSend.campaignId = selectedCampaignId;
    }

    const promise = fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    toast.promise(promise, {
      loading: 'Submitting your donation...',
      success: (res) => {
        if (!res.ok) throw new Error('Server responded with an error.');
        setName(''); setEmail(''); setPhone(''); setDonationType(''); setAmount(''); setSelectedCampaignId('');
        return "Thank you! Your donation has been recorded.";
      },
      error: 'Something went wrong. Please try again.',
      finally: () => setIsLoading(false),
    });
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Make a Donation</CardTitle>
        <CardDescription>Your support helps us make a difference.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Donate To (Optional)</Label>
            <Select onValueChange={setSelectedCampaignId} value={selectedCampaignId} disabled={isLoading}>
              <SelectTrigger><SelectValue placeholder="Select a cause" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Campaigns</SelectLabel>
                  <SelectItem value="general">General Donation</SelectItem>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={String(campaign.id)}>{campaign.title}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
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
              <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Money">Money</SelectItem>
                <SelectItem value="Food">Food Items</SelectItem>
                <SelectItem value="Clothes">Clothing</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditionally render the Amount input */}
          {donationType === 'Money' && (
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Donation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function DonatePage() {
    return (
        <main className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <Suspense fallback={<div className="w-full max-w-lg animate-pulse">Loading form...</div>}>
                <DonationForm />
            </Suspense>
        </main>
    );
}