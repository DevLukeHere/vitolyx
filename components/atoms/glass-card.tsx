import { View } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { cn } from '@/lib/utils/cn';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function GlassCard({ children, className }: GlassCardProps) {
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView
        className={cn('rounded-2xl overflow-hidden border border-white/10', className)}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View
      className={cn(
        'rounded-2xl border',
        'bg-white dark:bg-gunmetal/90',
        'border-black/5 dark:border-white/5',
        className,
      )}
    >
      {children}
    </View>
  );
}
