export interface SharedMfeProps<P> {
  component: React.ComponentType<P>;
  componentProps: P;
  wrapperClass?: string;
  loadingClass?: string;
}

export interface CounterProviderProps {
  children: React.ReactNode;
}
