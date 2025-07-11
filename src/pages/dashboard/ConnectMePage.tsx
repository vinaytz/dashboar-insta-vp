
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Instagram, Linkedin, Youtube } from 'lucide-react';

const socialLinks = [
  { href: 'https://www.instagram.com/vinaytz', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.linkedin.com/in/vinaytz', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.youtube.com/vinaytz', icon: Youtube, label: 'YouTube' },
  { href: 'https://github.com/vinaytz', icon: Github, label: 'GitHub' },
];

export default function ConnectMePage() {
  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">Connect with Vinaytz</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">Feel free to reach out or follow my work on these platforms:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            >
              <link.icon className="h-8 w-8" />
              <span className="text-lg font-semibold">{link.label}</span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
