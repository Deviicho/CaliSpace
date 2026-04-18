import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { Href, useRouter } from 'expo-router'
import React from 'react'
import BackgroundGlow from './BackgorundGlow';
import { colors } from '@/constants/colors';
interface Props {
  title: string;
  description: string;
  Icon: any;
  nextPath: Href;
  iconStyle?: object; //object means the value in key : value pairs (the one css uses)
  width: number;
  height: number;
}
const { width, height } = Dimensions.get('window');
const FeatureStructure = ({ title, description, Icon, nextPath, iconStyle, width, height }: Props) => {
  const router = useRouter();
  return (
    <>
    <BackgroundGlow />
    <View style={styles.container}>
    
      <View>
        <Icon style={[styles.icon, iconStyle]} width={width} height={height} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.buttonsContainer}>
         <TouchableOpacity style={styles.nextButton} onPress={() => router.push(nextPath)}>
            <Text style={styles.buttonText}>Next</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.skipButton} onPress={() => router.replace('/(onboarding)/feature5')}>
            <Text style={[styles.buttonText, {color: colors.Stext}]}>Skip Features</Text>
         </TouchableOpacity>
      </View>
      
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon:{
    marginTop: height * 0.08,
    color: '#D70000',
  },
  title: {
    marginTop: height*0.03,
    fontFamily: 'Poppins-Black',
    fontSize: 30,
    letterSpacing: -1,
    color: colors.Ptext,
    textAlign: 'center',

  },
  description: {
    marginTop: height*0.03,
    lineHeight: 25,
    textAlign: 'center',
    maxWidth: width* 0.8,
    color: colors.Stext
  },
  buttonsContainer: {
    width: width,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: height*0.2
  },

  nextButton: {
    marginTop: 20,
    backgroundColor: '#D70000', // Using your signature red
    padding: 10,
    width: '90%',
    borderRadius: 14,
    alignItems: 'center',
    minWidth: width*0.25,
    borderWidth: 0.5,
    borderColor: '#d8d8d883', 
    borderStyle: 'solid',
  },
  skipButton: {
    marginTop: 20,
    width: '90%',
    backgroundColor: '#d700000e', // Using your signature red
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
    minWidth: width*0.25,
    borderWidth: 0.5,
    borderColor: '#d8d8d883', 
    borderStyle: 'solid',
  },
  buttonText: {
    fontFamily: 'Poppins-bold',
    color: colors.Ptext,
    fontSize: 30,
    fontWeight: '700',
  },
});

export default FeatureStructure