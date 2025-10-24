export interface NavbarProps {
  className?: string;
}

export interface ProductCardProps {
  product: import('./Product').Product;
  onClick?: (id: string) => void;
}

export interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}