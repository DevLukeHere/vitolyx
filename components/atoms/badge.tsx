import { View, Text } from 'react-native';
import type { Flag } from '@/types/database';
import { cn } from '@/lib/utils/cn';

const FLAG_CONFIG = {
  low: {
    label: 'Low',
    className: 'bg-amber-500/15 dark:bg-amber-500/20' as const,
    textClassName: 'text-amber-600 dark:text-amber-400' as const,
  },
  normal: {
    label: 'Normal',
    className: 'bg-emerald-500/15 dark:bg-emerald-500/20' as const,
    textClassName: 'text-emerald-600 dark:text-emerald-400' as const,
  },
  high: {
    label: 'High',
    className: 'bg-red-500/15 dark:bg-red-500/20' as const,
    textClassName: 'text-red-600 dark:text-red-400' as const,
  },
} as const satisfies Record<Flag, { label: string; className: string; textClassName: string }>;

export function FlagBadge({ flag }: { flag: Flag }) {
  const config = FLAG_CONFIG[flag];
  return (
    <View className={cn('px-2.5 py-1 rounded-full', config.className)}>
      <Text className={cn('text-xs font-bold', config.textClassName)}>
        {config.label}
      </Text>
    </View>
  );
}
