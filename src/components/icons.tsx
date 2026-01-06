import type { SVGProps } from 'react';
import {
  BookUser,
  Dna,
  Factory,
  Leaf,
  MapPin,
  Stethoscope,
  FileText,
  Anchor,
} from 'lucide-react';

export function MediPortLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 11v4" />
      <path d="M10 13h4" />
    </svg>
  );
}

export {
  BookUser,
  Dna,
  Factory,
  Leaf,
  MapPin,
  Stethoscope,
  FileText,
  Anchor,
};
