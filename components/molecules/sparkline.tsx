import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import type { Flag } from '@/types/database';

const FLAG_COLOURS: Record<Flag, string> = {
  low: '#f59e0b',
  normal: '#22c55e',
  high: '#ef4444',
};

type SparklineProps = {
  data: number[];
  flag: Flag;
  color?: string;
  width?: number;
  height?: number;
};

export function Sparkline({ data, flag, color, width = 80, height = 32 }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data
    .map((v, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = padding + (1 - (v - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke={color ?? FLAG_COLOURS[flag]}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
