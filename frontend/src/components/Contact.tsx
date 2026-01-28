import { Mail, Linkedin, Github, Send, Phone, MapPin, Twitter } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { sendEmail } from "@/utils/emailClient";
import { toast } from "@/components/ui/sonner";
import { useRateLimit } from "@/hooks/useRateLimit";

// Form input types
interface ContactFormInputs {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
const canSend = useRateLimit(60_000); // 1 min

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>();

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
  if (!canSend()) {
    toast.error("Please wait 1 minute before sending another message");
    return;
  }

  setLoading(true);
  const toastId = toast.loading("Sending message...");

  try {
    await sendEmail(data);
    toast.success("Message sent successfully 🚀", { id: toastId });
    reset();
    setShowForm(false);
  } catch (err) {
    console.error(err);
    toast.error("Failed to send message. Try again later.", { id: toastId });
  } finally {
    setLoading(false);
  }
};


  return (
    <section id="contact" className="section-container">
      <div className="max-w-2xl mx-auto text-center">
        <ScrollAnimation>
          <div className="red-accent-line mx-auto" />
          <h2 className="section-title">Get In Touch</h2>
          <p className="text-muted-foreground text-lg mb-4">
            I'm currently looking for new opportunities and would love to hear
            from you. Whether you have a question, a project idea, or just want
            to connect — my inbox is always open.
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-primary" />
              <span>Miraj, Maharashtra</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone size={14} className="text-primary" />
              <span>+91 93226 96345</span>
            </div>
          </div>
        </ScrollAnimation>

        {/* Say Hello Button */}
        <ScrollAnimation delay={0.1}>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground
                       rounded-lg font-medium text-lg hover:bg-primary/90
                       transition-all duration-300 hover:scale-105
                       shadow-lg shadow-primary/20"
          >
            <Send size={20} />
            <span>Say Hello</span>
          </button>
        </ScrollAnimation>

        {/* Social Links */}
        <ScrollAnimation delay={0.2}>
          <div className="flex items-center justify-center space-x-8 mt-12">
            {/* Email */}
            <a
              href="mailto:neerajsurnis@gmail.com"
              className="flex flex-col items-center space-y-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="p-4 bg-card border border-border rounded-full group-hover:border-primary transition-colors">
                <Mail size={24} />
              </div>
              <span className="text-sm font-medium">Email</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/neeraj-surnis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="p-4 bg-card border border-border rounded-full group-hover:border-primary transition-colors">
                <Linkedin size={24} />
              </div>
              <span className="text-sm font-medium">LinkedIn</span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/NEERAJ-45"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="p-4 bg-card border border-border rounded-full group-hover:border-primary transition-colors">
                <Github size={24} />
              </div>
              <span className="text-sm font-medium">GitHub</span>
            </a>

            {/* Twitter / X */}
            <a
              href="https://twitter.com/YOUR_USERNAME"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="p-4 bg-card border border-border rounded-full group-hover:border-primary transition-colors">
                <Twitter size={24} />
              </div>
              <span className="text-sm font-medium">Twitter</span>
            </a>
          </div>
        </ScrollAnimation>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card p-8 rounded-2xl max-w-md w-full relative
                          shadow-2xl shadow-primary/20 border border-primary/10">

            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors text-xl"
            >
              ✕
            </button>

            <h3 className="text-3xl font-bold text-foreground mb-6 text-center">
              Send me a message
            </h3>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                placeholder="Your Name"
                {...register("name", { required: "Name is required" })}
                className="bg-background/80 border border-muted-foreground/20
                           focus:border-primary focus:ring-1 focus:ring-primary
                           rounded-lg px-4 py-3 outline-none transition-all"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

              <input
                type="email"
                placeholder="Your Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                })}
                className="bg-background/80 border border-muted-foreground/20
                           focus:border-primary focus:ring-1 focus:ring-primary
                           rounded-lg px-4 py-3 outline-none transition-all"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

              <textarea
                rows={5}
                placeholder="Your Message"
                {...register("message", { required: "Message is required" })}
                className="bg-background/80 border border-muted-foreground/20
                           focus:border-primary focus:ring-1 focus:ring-primary
                           rounded-lg px-4 py-3 resize-none outline-none transition-all"
              />
              {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3
                           bg-primary text-primary-foreground rounded-xl font-semibold
                           hover:bg-primary/90 active:scale-95 transition-all
                           shadow-md shadow-primary/30
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send size={20} />
                <span>{loading ? "Sending..." : "Send Message"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
