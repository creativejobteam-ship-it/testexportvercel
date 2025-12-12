'use client';

const Footer = () => {
  const links = {
    Product: ["Features", "Integrations", "Pricing", "Changelog"],
    Company: ["About", "Careers", "Blog", "Contact"],
    Resources: ["Documentation", "Help Center", "Community", "API"],
    Legal: ["Privacy", "Terms", "Security", "Status"],
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="font-bold text-xl mb-4">ProjectX</div>
            <p className="text-sm text-muted-foreground">
              Making project management effortless for modern teams.
            </p>
          </div>
          
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ProjectX Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              GitHub
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;