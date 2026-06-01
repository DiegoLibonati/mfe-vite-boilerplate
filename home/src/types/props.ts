export interface SharedMfeProps<P> {
  component: React.ComponentType<P>;
  componentProps: P;
  wrapperClass?: string;
}
