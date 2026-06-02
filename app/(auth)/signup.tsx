// signup.tsx
import { TouchableOpacity, Pressable, StyleSheet, Image, TextInput, View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Alert } from 'react-native'
import { colors } from '@/constants/colors'
import { useAuth, useSignUp, useOAuth } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Ionicons } from '@expo/vector-icons'
import BackgroundGlow from '@/components/BackgorundGlow';

WebBrowser.maybeCompleteAuthSession();

const { height } = Dimensions.get('window');

export default function Page() {
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const { signUp, isLoaded: signUpLoaded, setActive } = useSignUp()
  const { isSignedIn } = useAuth()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google', redirectUrl: 'calispace://oauth-callback' })
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [emailError, setEmailError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')
  const [generalError, setGeneralError] = React.useState('')
  const [codeError, setCodeError] = React.useState('')

  const handleGoogleSignUp = async () => {
    try {
      const { createdSessionId, setActive: setActiveSession } = await startOAuthFlow()
      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId })
        router.replace('/(tabs)/Home')
      }
    } catch (err: any) {
      setGeneralError('Google sign-up failed. Please try again.')
      
      // DEBUG ALERT FOR GOOGLE SSO SIGNUP
      const errMsg = err?.errors?.[0]?.longMessage || err?.message || "Unknown OAuth Error";
      Alert.alert(
        "🚨 SIGNUP GOOGLE DEBUG",
        `Message: ${errMsg}\n\nFull Details: ${JSON.stringify(err, null, 2)}`
      );
    }
  }

  const handleSubmit = async () => {
    if (!signUpLoaded || !signUp) return;
    setEmailError('')
    setPasswordError('')
    setGeneralError('')

    try {
      await signUp.create({ emailAddress, password, ...(username ? { username } : {}) })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true);
    } catch (err: any) {
      // DEBUG ALERT FOR MANUAL SIGNUP FLOW
      const errMsg = err?.errors?.[0]?.longMessage || err?.message || "Unknown Manual Signup Error";
      Alert.alert(
        "🚨 MANUAL SIGNUP DEBUG",
        `Message: ${errMsg}\n\nFull Details: ${JSON.stringify(err, null, 2)}`
      );

      const errors = err?.errors || []
      errors.forEach((e: any) => {
        if (e.meta?.paramName === 'email_address') setEmailError(e.longMessage || e.message)
        else if (e.meta?.paramName === 'password') setPasswordError(e.longMessage || e.message)
        else setGeneralError(e.longMessage || e.message)
      })
    }
  }

  const handleVerify = async () => {
    if (!signUpLoaded || !signUp || !setActive) return;
    setCodeError('')
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code })
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(tabs)/Home')
      }
    } catch (err: any) {
      // DEBUG ALERT FOR SIGNUP VERIFICATION STEP
      const errMsg = err?.errors?.[0]?.longMessage || err?.message || "Unknown Verification Error";
      Alert.alert(
        "🚨 SIGNUP VERIFICATION DEBUG",
        `Message: ${errMsg}\n\nFull Details: ${JSON.stringify(err, null, 2)}`
      );

      const errors = err?.errors || []
      errors.forEach((e: any) => setCodeError(e.longMessage || e.message))
    }
  }

  if (isSignedIn) return null

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} behavior='padding'>
        <BackgroundGlow />
        
          <Text style={styles.title}>Verify your account</Text>
          <Text style={styles.secondaryTitle}>Enter the code we sent to your email</Text>

          <Text style={styles.label}>Verification code</Text>
          <TextInput
            style={[styles.input, codeError ? styles.inputError : null]}
            value={code}
            placeholder="Enter your verification code"
            placeholderTextColor="#666666"
            onChangeText={(code) => { setCode(code); setCodeError('') }}
            keyboardType="numeric"
          />
          {codeError ? <Text style={styles.errorText}>{codeError}</Text> : null}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleVerify}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={() => { setCodeError(''); signUp?.prepareEmailAddressVerification({ strategy: 'email_code' }) }}
          >
            <Text style={styles.secondaryButtonText}>I need a new code</Text>
          </Pressable>
      </KeyboardAvoidingView>
    )
  }

  return (
    <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} behavior='padding'>
      <BackgroundGlow />
        <View style={{ alignItems: 'center', marginBottom: 0 }}>
          <Image source={require('@/assets/images/CaliSpace_logo.png')} style={styles.logo} />
          <Text style={styles.name}>CaliSpace</Text>
        </View>

        <View style={{ marginBottom: height < 700 ? 10 : 20 }}>
          <Text style={styles.title}>Join the community</Text>
          <Text style={styles.secondaryTitle}>Create an account to start your journey</Text>
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

        <Text style={styles.label}>Username <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={username}
          placeholder="Enter username"
          placeholderTextColor="#666666"
          onChangeText={(u) => setUsername(u)}
        />

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
          <Text style={styles.buttonText}>Sign up</Text>
        </Pressable>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
          <Ionicons name="logo-google" size={20} color={colors.Ptext} />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Text style={{ color: colors.Ptext, fontFamily: 'Poppins-Regular' }}>Already have an account? </Text>
          <Link href="/(auth)/login">
            <Text style={{ color: colors.icons, fontFamily: 'Poppins-SemiBold' }}>Sign in</Text>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: '#151414'
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
    fontSize: height < 700 ? 24 : 30,
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
  optional: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666666',
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.7,
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
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
    gap: 4,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
})