'use client';

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ReviewCardProps {
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

const ReviewCard = ({ name, role, image, content, rating }: ReviewCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl bg-card border border-border shadow-sm"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-lg mb-6 leading-relaxed">"{content}"</p>
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image 
            src={image} 
            alt={name} 
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;