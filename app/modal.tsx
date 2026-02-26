import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { useThemeColor } from '@/hooks/use-theme-color';

export default function ModalScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const color = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color }]}>Modal</Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text style={{ color: tint }}>Go to home screen</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
