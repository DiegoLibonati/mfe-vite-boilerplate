export interface SharedMfeProps<P> {
  component: React.ComponentType<P>;
  componentProps: P;
  wrapperClass?: string;
}

export interface CounterProviderProps {
  children: React.ReactNode;
}
