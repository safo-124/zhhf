import { NewsletterForm } from "@/components/newsletter-form"; // Import the new component

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Zion Helping Hand Foundation</h1>
        <p className="text-lg text-muted-foreground mt-2">Welcome to our official website.</p>
      </div>

      {/* Add the newsletter form here */}
      <NewsletterForm />

    </main>
  );
}