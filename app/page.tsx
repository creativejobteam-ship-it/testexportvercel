import Hero from "@/components/Hero";
import AppGrid from "@/components/AppGrid";
import FeatureCard from "@/components/FeatureCard";
import ReviewCard from "@/components/ReviewCard";
import WaitlistCTA from "@/components/WaitlistCTA";
import Footer from "@/components/Footer";
import { 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  Globe, 
  Smartphone 
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Lightning Fast",
      description: "Optimized for speed with edge caching and instant updates."
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and SOC2 compliant infrastructure."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
      title: "Advanced Analytics",
      description: "Deep insights into your team's performance and productivity."
    },
    {
      icon: <Users className="w-6 h-6 text-purple-500" />,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with live cursors and comments."
    },
    {
      icon: <Globe className="w-6 h-6 text-cyan-500" />,
      title: "Global CDN",
      description: "Content delivered from the edge, wherever you are."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-pink-500" />,
      title: "Mobile First",
      description: "Fully responsive design that works perfectly on any device."
    }
  ];

  const reviews = [
    {
      name: "Sarah Chen",
      role: "Product Manager at TechFlow",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
      content: "This tool has completely transformed how our team manages sprints. The interface is intuitive and the features are exactly what we needed.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO at StartupX",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
      content: "The best project management solution we've used in years. The API integration capabilities are outstanding.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Design Lead at Creative Co",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
      content: "Finally, a tool that looks as good as it works. The attention to detail in the UI/UX is impressive.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      
      <section className="py-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to ship faster
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to help your team build better products with less friction.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Integrates with your favorite tools
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect seamlessly with the apps you already use every day.
            </p>
          </div>
          <AppGrid />
        </div>
      </section>

      <section className="py-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by industry leaders
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what our customers have to say about their experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <ReviewCard 
              key={index} 
              name={review.name}
              role={review.role}
              image={review.image}
              content={review.content}
              rating={review.rating}
            />
          ))}
        </div>
      </section>

      <WaitlistCTA />
      <Footer />
    </div>
  );
}