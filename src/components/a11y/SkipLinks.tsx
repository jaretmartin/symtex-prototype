import { cn } from '@/lib/utils';

interface SkipLink {
  href: string;
  label: string;
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#main-navigation', label: 'Skip to navigation' },
];

export function SkipLinks({ links = defaultLinks }: { links?: SkipLink[] }) {
  return (
    <div className="skip-links">
      {links.map(link => (
        <a
          key={link.href}
          href={link.href}
          className={cn(
            'sr-only focus:not-sr-only',
            'focus:fixed focus:top-4 focus:left-4 focus:z-[100]',
            'focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground',
            'focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring'
          )}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
