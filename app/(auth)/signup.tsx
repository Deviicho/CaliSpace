import { TouchableOpacity, Pressable, StyleSheet, TextInput, View, Text } from 'react-native'
import { colors } from '@/constants/colors'
import { useAuth, useSignUp, useOAuth } from '@clerk/clerk-expo'
import { type Href, Link, useRouter } from 'expo-router'
import React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Ionicons } from '@expo/vector-icons'

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const { signUp, isLoaded: signUpLoaded, setActive } = useSignUp()
  const { isSignedIn } = useAuth()
  const { startOAuthFlow } = useOAuth({ 
    strategy: 'oauth_google',
    redirectUrl: 'calispace://oauth-callback'
  })
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  const handleGoogleSignUp = async () => {
    try {
      const { createdSessionId, setActive: setActiveSession } = await startOAuthFlow()
      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId })
        router.replace('/(tabs)/Home')
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const handleSubmit = async () => {
    if (!signUpLoaded || !signUp) return;
    try {
      await signUp.create({ emailAddress, password, ...(username ? { username } : {}) })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const handleVerify = async () => {
    if (!signUpLoaded || !signUp || !setActive) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code })
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(tabs)/Home')
      } else {
        console.error('Sign-up attempt not complete:', completeSignUp)
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (isSignedIn) return null

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify your account</Text>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleVerify}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => signUp?.prepareEmailAddressVerification({ strategy: 'email_code' })}
        >
          <Text style={styles.secondaryButtonText}>I need a new code</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>

      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666666"
        onChangeText={(email) => setEmailAddress(email)}
        keyboardType="email-address"
      />

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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#666666"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          onChangeText={(pass) => setPassword(pass)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#666666" />
        </TouchableOpacity>
      </View>

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
        <Ionicons name="logo-google" size={20} color="#fff" />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Text style={{color: '#fff'}}>Already have an account? </Text>
        <Link href="/(auth)/login">
          <Text style={{color: colors.icons}}>Sign in</Text>
        </Link>
      </View>

      <View nativeID="clerk-captcha" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: '#151414',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
  },
  optional: {
    fontWeight: '400',
    fontSize: 12,
    color: '#666666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#1e1e1e',
    color: '#fff',
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
    color: '#fff',
  },
  eyeButton: {
    padding: 12,
  },
  button: {
    backgroundColor: '#E31C25',
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
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
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
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  linkContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 12,
    alignItems: 'center',
  },
})