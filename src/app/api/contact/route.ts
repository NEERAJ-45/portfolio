import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ message: 'Name must be at least 2 characters' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Valid email is required' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json({ message: 'Message must be at least 10 characters' }, { status: 400 });
    }

    // Attempt to forward via EmailJS if configured
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (serviceId && templateId && publicKey) {
      const emailjs = await import('@emailjs/nodejs');
      await emailjs.send(
        serviceId,
        templateId,
        { from_name: name.trim(), reply_to: email.trim(), message: message.trim() },
        { publicKey, privateKey },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'Service unavailable' }, { status: 500 });
  }
}
