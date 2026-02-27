import { View } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { cn } from '@/lib/utils/cn';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

const RADIUS = 24;

export function GlassCard({ children, className }: GlassCardProps) {
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView style={{ borderRadius: RADIUS, overflow: 'hidden' }}>
        <View className={cn('border border-white/10', className)}>
          {children}
        </View>
      </GlassView>
    );
  }

  return (
    <View
      style={{ borderRadius: RADIUS }}
      className={cn(
        'border overflow-hidden',
        'bg-white dark:bg-gunmetal/90',
        'border-black/5 dark:border-white/5',
        className,
      )}
    >
      {children}
    </View>
  );
}
