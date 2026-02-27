import { Pressable, Text, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils/cn';
import { Palette } from '@/constants/theme';

const VARIANTS = {
  filled: {
    container: 'bg-brand-500 active:bg-brand-600',
    text: 'text-white font-semibold',
  },
  ghost: {
    container: 'bg-transparent active:bg-brand-500/10',
    text: 'text-brand-500 font-semibold',
  },
  danger: {
    container: 'bg-red-500/10 active:bg-red-500/20',
    text: 'text-red-500 font-semibold',
  },
} as const;

type PrimaryButtonProps = {
  onPress: () => void;
  label: string;
  loading?: boolean;
  variant?: keyof typeof VARIANTS;
  className?: string;
  disabled?: boolean;
};

export function PrimaryButton({
  onPress,
  label,
  loading,
  variant = 'filled',
  className,
  disabled,
}: PrimaryButtonProps) {
  const config = VARIANTS[variant];

  return (
    <Pressable
      onPress={() => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
      }}
      disabled={disabled || loading}
      className={cn(
        'rounded-xl px-6 py-3.5 items-center justify-center',
        config.container,
        (disabled || loading) && 'opacity-40',
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'filled' ? '#fff' : Palette.teal}
          size="small"
        />
      ) : (
        <Text className={cn('text-base', config.text)}>{label}</Text>
      )}
    </Pressable>
  );
}
