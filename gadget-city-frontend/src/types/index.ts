export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };