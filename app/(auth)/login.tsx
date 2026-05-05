import { Pressable, StyleSheet, TextInput, View, Text } from 'react-native'
import { useSignIn } from '@clerk/clerk-expo' // Fixed import
import { type Href, Link, useRouter } from 'expo-router'
import React from 'react'
import { colors } from '@/constants/colors'

export default function Page() {
  const { signIn, isLoaded: signInLoaded, setActive } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const [isVerifying, setIsVerifying] = React.useState(false)

  // 1. Handle standard Email/Password Login
  const handleSubmit = async () => {
    if (!signInLoaded || !signIn) return

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(tabs)/Home')
      } else if (result.status === 'needs_second_factor' || (result.status as any) === 'needs_client_trust') {
        // If your Clerk settings require MFA
        setIsVerifying(true)
      } else {
        console.error('Sign-in not complete:', result)
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // 2. Handle MFA/Verification (if needed)
  const handleVerify = async () => {
  if (!signInLoaded || !signIn || !setActive) return

  try {
    const result = await signIn.attemptFirstFactor({
      strategy: 'email_code',
      code,
    })

    if (result.status === 'complete') {
      await setActive({ session: result.createdSessionId })
      router.replace('/(tabs)/Home')
    }
  } catch (err: any) {
    console.error("Verification Error:", JSON.stringify(err, null, 2))
  }
}

  // Verification Screen UI
  if (isVerifying) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify your account</Text>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#666666"
          onChangeText={setCode}
          keyboardType="numeric"
        />
        <Pressable style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => setIsVerifying(false)}>
          <Text style={styles.secondaryButtonText}>Back to Login</Text>
        </Pressable>
      </View>
    )
  }

  // Main Login UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666666"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#666666"
        secureTextEntry={true}
        autoCapitalize="none"
        onChangeText={setPassword}
      />

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

      <View style={styles.linkContainer}>
        <Text style={{ color: '#fff' }}>Don't have an account? </Text>
        <Link href="/(auth)/signup">
          <Text style={{ color: colors.icons, fontWeight: 'bold' }}>Sign up</Text>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: '#151414',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#E31C25',
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
})