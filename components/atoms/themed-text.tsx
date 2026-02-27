import { Text, type TextProps } from 'react-native';
import { cn } from '@/lib/utils/cn';

const VARIANTS = {
  title: 'text-2xl font-bold tracking-tight text-charcoal dark:text-cloud',
  subtitle: 'text-lg font-semibold text-charcoal dark:text-cloud',
  body: 'text-base text-gunmetal dark:text-cloud/80',
  caption: 'text-sm text-gunmetal/70 dark:text-cloud/50',
  mono: 'text-base font-mono text-charcoal dark:text-cloud',
  label: 'text-xs font-semibold uppercase tracking-widest text-gunmetal/60 dark:text-cloud/40',
} as const;

type ThemedTextProps = TextProps & {
  variant?: keyof typeof VARIANTS;
  className?: string;
};

export function ThemedText({ variant = 'body', className, ...props }: ThemedTextProps) {
  return <Text className={cn(VARIANTS[variant], className)} {...props} />;
}
