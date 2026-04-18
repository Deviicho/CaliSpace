import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';

const { width, height } = Dimensions.get('window');
const GLOW_SIZE = width * 1.2;

export default function BackgroundGlow() {
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Top Red Glow */}
      <Image source={require('@/assets/images/bluredCircle.png')} style={[styles.circle, styles.top]} />
      
      {/* Bottom Red Glow */}
      <Image source={require('@/assets/images/bluredCircle.png')} style={[styles.circle, styles.bottom]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    flexDirection: 'column',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: width * 2.5,
    height: width * 2.5,
    left: '50%', 
    marginLeft: -(GLOW_SIZE / 1),
    
  },
  top: {
    top: -height * 0.6,
  },
  bottom: {
    bottom: -height * 1.7,
  },
});