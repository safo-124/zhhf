import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'ZHHF Website <onboarding@resend.dev>', // The default Resend address
      to: 'nanasafo122@gmail.com', // IMPORTANT: Replace with the foundation's actual email address
      subject: `New Contact Form Message from ${name}`,
      reply_to: email, // So you can reply directly to the user
      html: `
        <div>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}