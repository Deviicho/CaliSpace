import { Pressable, StyleSheet, TextInput, View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native'
import { useSignIn, useOAuth } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { colors } from '@/constants/colors'
import * as WebBrowser from 'expo-web-browser'
import { Ionicons } from '@expo/vector-icons'
import BackgroundGlow from '@/components/BackgorundGlow';

WebBrowser.maybeCompleteAuthSession();

const { height } = Dimensions.get('window');

export default function Page() {
  const { signIn, isLoaded: signInLoaded, setActive } = useSignIn()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google', redirectUrl: 'calispace://oauth-callback' })
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [emailError, setEmailError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')
  const [generalError, setGeneralError] = React.useState('')
  const [codeError, setCodeError] = React.useState('')

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive: setActiveSession } = await startOAuthFlow()
      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId })
        router.replace('/(tabs)/Home')
      }
    } catch (err: any) {
      setGeneralError('Google sign-in failed. Please try again.')
    }
  }

  const handleSubmit = async () => {
    if (!signInLoaded || !signIn) return
    setEmailError('')
    setPasswordError('')
    setGeneralError('')

    try {
      const result = await signIn.create({ identifier: emailAddress, password })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(tabs)/Home')
      } else if (result.status === 'needs_second_factor' || (result.status as any) === 'needs_client_trust') {
        setIsVerifying(true)
      }
    } catch (err: any) {
      const errors = err?.errors || []
      errors.forEach((e: any) => {
        if (e.code === 'form_identifier_not_found') setEmailError(e.longMessage || e.message)
        else if (e.code === 'form_password_incorrect') setPasswordError(e.longMessage || e.message)
        else setGeneralError(e.longMessage || e.message)
      })
    }
  }

  const handleVerify = async () => {
    if (!signInLoaded || !signIn || !setActive) return
    setCodeError('')
    try {
      const result = await signIn.attemptFirstFactor({ strategy: 'email_code', code })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(tabs)/Home')
      }
    } catch (err: any) {
      const errors = err?.errors || []
      errors.forEach((e: any) => setCodeError(e.longMessage || e.message))
    }
  }

  if (isVerifying) {
    return (
      <View style={{ flex: 1 }}>
        <BackgroundGlow />
        <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} behavior='padding'>
          <Text style={styles.title}>Verify your account</Text>
          <Text style={styles.secondaryTitle}>Enter the code we sent to your email</Text>

          <Text style={styles.label}>Verification code</Text>
          <TextInput
            style={[styles.input, codeError ? styles.inputError : null]}
            value={code}
            placeholder="Enter verification code"
            placeholderTextColor="#666666"
            onChangeText={(c) => { setCode(c); setCodeError('') }}
            keyboardType="numeric"
          />
          {codeError ? <Text style={styles.errorText}>{codeError}</Text> : null}

          <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={handleVerify}>
            <Text style={styles.buttonText}>Verify</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => setIsVerifying(false)}>
            <Text style={styles.secondaryButtonText}>Back to Login</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGlow />
      <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} behavior='padding'>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Image source={require('@/assets/images/CaliSpace_logo.png')} style={styles.logo} />
          <Text style={styles.name}>CaliSpace</Text>
        </View>

        <View style={{ marginBottom: height < 700 ? 10 : 20 }}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.secondaryTitle}>Login to continue your progress</Text>
        </View>

        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#666666"
          onChangeText={(email) => { setEmailAddress(email); setEmailError('') }}
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={styles.label}>Password</Text>
        <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            placeholder="Enter password"
            placeholderTextColor="#666666"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            onChangeText={(pass) => { setPassword(pass); setPasswordError('') }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#666666" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        {generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            (!emailAddress || !password) && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={!emailAddress || !password}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Ionicons name="logo-google" size={20} color={colors.Ptext} />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Text style={{ color: colors.Ptext, fontFamily: 'Poppins-Regular' }}>Don't have an account? </Text>
          <Link href="/(auth)/signup">
            <Text style={{ color: colors.icons, fontFamily: 'Poppins-SemiBold' }}>Sign up</Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  verifyContainer: {
    padding: 20,
    gap: 12,
    justifyContent: 'center',
    flexGrow: 1,
  },
  logo: {
    height: height * 0.11,
    width: height * 0.13,
    alignSelf: 'center',
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    color: '#D70000',
    fontSize: height < 700 ? 24 : 30,
    letterSpacing: -1,
    alignSelf: 'center',
  },
  title: {
    fontSize: height < 700 ? 28 : 35,
    fontFamily: 'Poppins-Bold',
    color: colors.Ptext,
    marginBottom: 0,
    textAlign: 'center',
  },
  secondaryTitle: {
    fontSize: height < 700 ? 13 : 16,
    fontFamily: 'Poppins-Regular',
    color: colors.Stext,
    marginBottom: height < 700 ? 5 : 10,
    textAlign: 'center',
  },
  label: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: colors.Ptext,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#1e1e1e',
    color: colors.Ptext,
  },
  inputError: {
    borderColor: '#D70000',
  },
  errorText: {
    color: '#D70000',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: -8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.Ptext,
  },
  eyeButton: {
    padding: 12,
  },
  button: {
    backgroundColor: '#D70000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.Ptext,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  secondaryButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  secondaryButtonText: {
    color: colors.Ptext,
    fontFamily: 'Poppins-SemiBold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#666666',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 12,
    borderRadius: 8,
  },
  googleButtonText: {
    color: colors.Ptext,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
})