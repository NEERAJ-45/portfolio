import type { VercelRequest, VercelResponse } from "@vercel/node";
import emailjs from "@emailjs/nodejs";
import rateLimit from "@/utils/rateLimit";

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await limiter.check(res, 5, req.headers["x-forwarded-for"] || "anon"); // 5 req/min

    const { name, email, message } = req.body;

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        from_name: name,
        reply_to: email,
        message,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      }
    );

    return res.status(200).json({ success: true });
  } catch {
    return res.status(429).json({ message: "Too many requests" });
  }
}
