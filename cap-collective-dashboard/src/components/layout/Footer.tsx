import Link from 'next/link';
import { Recycle, Leaf, Github, Twitter, MessageSquare, Mail, Clock } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Dashboard', href: '/' },
    { name: 'Impact Reports', href: '/impact' },
    { name: 'Product Catalog', href: '/products' },
    { name: 'Student Leaderboard', href: '/students' },
    { name: 'API Documentation', href: '/api-docs' },
  ],
  resources: [
    { name: 'Teacher Guide', href: '/teacher-guide' },
    { name: 'Safety SOPs', href: '/safety' },
    { name: 'Lesson Plans', href: '/lessons' },
    { name: 'Grant Templates', href: '/grants' },
    { name: 'CAD Files', href: '/cad' },
  ],
  community: [
    { name: 'Discord Server', href: 'https://discord.gg/capcollective', external: true },
    { name: 'GitHub', href: 'https://github.com/capcollective', external: true },
    { name: 'Twitter', href: 'https://twitter.com/capcollective', external: true },
    { name: 'Instructables', href: 'https://instructables.com/capcollective', external: true },
    { name: 'Email Us', href: 'mailto:hello@capcollective.org' },
  ],
  organization: [
    { name: 'About Us', href: '/about' },
    { name: 'Partner Schools', href: '/partners' },
    { name: 'Press Kit', href: '/press' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
};

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/capcollective', icon: Github, external: true },
  { name: 'Twitter', href: 'https://twitter.com/capcollective', icon: Twitter, external: true },
  { name: 'Discord', href: 'https://discord.gg/capcollective', icon: MessageSquare, external: true },
  { name: 'Email', href: 'mailto:hello@capcollective.org', icon: Mail, external: true },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2" aria-label="Cap Collective Home">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cap-600">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900">Cap Collective</span>
            </Link>
            <p className="text-gray-600 text-base leading-relaxed max-w-xs">
              Building a circular economy in schools. Students collect bottle caps, process them into flakes, 
              and manufacture valuable products while learning STEM, entrepreneurship, and environmental stewardship.
            </p>
            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-cap-600 transition-colors"
                  aria-label={social.name}
                  target={social.external ? '_blank' : undefined}
                  rel={social.external ? 'noopener noreferrer' : undefined}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Navigation Columns */}
          <div className="mt-10 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Product</h3>
                <ul className="mt-4 space-y-3" role="list">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-gray-600 hover:text-cap-600 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resources</h3>
                <ul className="mt-4 space-y-3" role="list">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-gray-600 hover:text-cap-600 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Community</h3>
                <ul className="mt-4 space-y-3" role="list">
                  {footerLinks.community.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-600 hover:text-cap-600 transition-colors flex items-center gap-1.5"
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                      >
                        {link.name}
                        {link.external && <span className="text-xs" aria-hidden="true">↗</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Organization</h3>
                <ul className="mt-4 space-y-3" role="list">
                  {footerLinks.organization.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-gray-600 hover:text-cap-600 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Cap Collective. Open source under MIT License. Built by students, for students.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Leaf className="h-4 w-4 text-cap-600" aria-hidden="true" />
                <span>100% student-led</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>Live data updates every 60s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}