'use client';

import { motion } from "framer-motion";
import Image from "next/image";

const apps = [
  { name: "Slack", icon: "https://cdn.simpleicons.org/slack" },
  { name: "GitHub", icon: "https://cdn.simpleicons.org/github" },
  { name: "Figma", icon: "https://cdn.simpleicons.org/figma" },
  { name: "Notion", icon: "https://cdn.simpleicons.org/notion" },
  { name: "Linear", icon: "https://cdn.simpleicons.org/linear" },
  { name: "Zoom", icon: "https://cdn.simpleicons.org/zoom" },
  { name: "Discord", icon: "https://cdn.simpleicons.org/discord" },
  { name: "VS Code", icon: "https://cdn.simpleicons.org/visualstudiocode" },
];

const AppGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {apps.map((app, index) => (
        <motion.div
          key={app.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 mb-3 relative grayscale group-hover:grayscale-0 transition-all duration-300">
            <Image 
              src={app.icon} 
              alt={app.name} 
              width={48} 
              height={48}
              className="object-contain" 
            />
          </div>
          <span className="font-medium text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            {app.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default AppGrid;