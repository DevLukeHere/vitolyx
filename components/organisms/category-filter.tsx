import { ScrollView, Pressable, Text } from 'react-native';
import { MARKER_CATEGORIES, CATEGORY_LABELS, type MarkerCategory } from '@/types/database';
import { cn } from '@/lib/utils/cn';

type CategoryFilterProps = {
  selected: MarkerCategory | null;
  onChange: (category: MarkerCategory | null) => void;
};

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const items: { key: string; label: string; value: MarkerCategory | null }[] = [
    { key: 'all', label: 'All', value: null },
    ...MARKER_CATEGORIES.filter((c) => c !== 'other').map((cat) => ({
      key: cat,
      label: CATEGORY_LABELS[cat],
      value: cat as MarkerCategory,
    })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4 gap-2"
    >
      {items.map((item) => {
        const isActive = item.value === selected;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.value === selected ? null : item.value)}
            className={cn(
              'px-4 py-2 rounded-full border',
              isActive
                ? 'bg-brand-500 border-brand-500'
                : 'bg-transparent border-gunmetal/20 dark:border-cloud/10',
            )}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                isActive
                  ? 'text-white'
                  : 'text-gunmetal dark:text-cloud/60',
              )}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
