'use client';

import Link from 'next/link';
import { Button } from './Button';
import { ReactNode } from 'react';

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
}) => {
  return (
    <Link href={href} style={{ display: 'inline-block' }}>
      <Button variant={variant} size={size}>
        {children}
      </Button>
    </Link>
  );
};
