import { View, TextInput as RNTextInput, Text, type TextInputProps } from 'react-native';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

type StyledInputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerClassName?: string;
};

export const StyledInput = forwardRef<RNTextInput, StyledInputProps>(
  function StyledInput({ label, error, containerClassName, className, ...props }, ref) {
    return (
      <View className={cn('gap-1.5', containerClassName)}>
        {label && (
          <Text className="text-xs font-semibold uppercase tracking-widest text-gunmetal/60 dark:text-cloud/40">
            {label}
          </Text>
        )}
        <RNTextInput
          ref={ref}
          placeholderTextColor="#6B7280"
          className={cn(
            'rounded-xl border px-4 py-3.5 text-base',
            'bg-white dark:bg-white/5',
            'text-charcoal dark:text-cloud',
            error
              ? 'border-red-500'
              : 'border-black/5 dark:border-white/10',
            className,
          )}
          {...props}
        />
        {error && (
          <Text className="text-xs text-red-500 font-medium">{error}</Text>
        )}
      </View>
    );
  },
);
