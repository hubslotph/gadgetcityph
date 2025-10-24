declare module '@heroicons/react/*';
declare module '@heroicons/react/outline' {
  export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const XIcon: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare module '@heroicons/react/solid' {
  export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}