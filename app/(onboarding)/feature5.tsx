import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundGlow from '@/components/BackgorundGlow';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { Href, useRouter } from 'expo-router'
import React from 'react'
import { colors } from '@/constants/colors';
import Icon from '@/assets/icons/cloud-check-fill 1.svg'

const { width, height } = Dimensions.get('window');
export default function Feature5Screen() {
  const router = useRouter();
  

  const handleFinish = async () => {
    try {
      // 1. Save the completion status to the phone's memory
      await AsyncStorage.setItem('onboarding_complete', 'true');
      
      router.replace('/(auth)/signup');
    } catch (e) {
      console.error("Failed to save onboarding state", e);
    }
  };

  return (
    <>
        <BackgroundGlow />
        <View style={styles.container}>
        
          <View>
            <Icon style={styles.icon} width={250} height={240} />
          </View>
    
          <Text style={styles.title}>Cloud Sync</Text>
          <Text style={styles.description}>{'"Your progress, always with you."\nYour data is securely saved and synced across sessions never lose a workout, no matter what device you\'re on.'}</Text>
          <View style={styles.buttonsContainer}>
             <TouchableOpacity style={styles.nextButton} onPress={handleFinish}>
                <Text style={styles.buttonText}>Create Account</Text>
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
        marginTop: height*0.3
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
      buttonText: {
        fontFamily: 'Poppins-bold',
        color: colors.Ptext,
        fontSize: 30,
        fontWeight: '700',
      },
    });