import { Pressable, StyleSheet, TextInput, View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { colors } from '@/constants/colors';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import BackgroundGlow from '@/components/BackgorundGlow';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');
const scale = (size: number) => (width / 390) * size;

export default function Page() {
  const { signIn, isLoaded: signInLoaded, setActive } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google', redirectUrl: 'calispace://oauth-callback' });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [generalError, setGeneralError] = React.useState('');

  const handleGoogleSignIn = async () => {
    setGeneralError('');
    try {
      const result = await startOAuthFlow();
      const { createdSessionId, setActive: setActiveSession } = result;
      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId });
        router.replace('/(tabs)/Home');
      } else {
        setGeneralError('Google sign-in was cancelled or failed. Please try again.');
      }
    } catch {
      setGeneralError('Google sign-in failed. Verify your connection or Google credentials.');
    }
  };

  const handleSubmit = async () => {
    if (!signInLoaded || !signIn) return;
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    try {
      const result = await signIn.create({ identifier: emailAddress, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)/Home');
      } else {
        setGeneralError('Authentication context incomplete. Contact support.');
      }
    } catch (err: any) {
      const errors = err?.errors || [];
      if (errors.length === 0) {
        setGeneralError(err?.message || 'An error occurred during authentication.');
        return;
      }
      errors.forEach((e: any) => {
        const message = e.longMessage || e.message;
        if (e.code === 'form_identifier_not_found' || e.meta?.paramName === 'identifier') {
          setEmailError(message);
        } else if (e.code === 'form_password_incorrect' || e.meta?.paramName === 'password') {
          setPasswordError(message);
        } else {
          setGeneralError(message);
        }
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGlow />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image source={require('@/assets/images/CaliSpace_logo.png')} style={styles.logo} />
            <Text style={styles.name}>CaliSpace</Text>
          </View>

          <View style={styles.headerContainer}>
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
            onChangeText={(email) => { setEmailAddress(email); setEmailError(''); }}
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
              onChangeText={(pass) => { setPassword(pass); setPasswordError(''); }}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    height: Math.min(height * 0.1, 90),
    width: Math.min(height * 0.12, 108),
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    color: '#D70000',
    fontSize: scale(28),
    letterSpacing: -1,
  },
  headerContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: scale(30),
    fontFamily: 'Poppins-Bold',
    color: colors.Ptext,
    textAlign: 'center',
  },
  secondaryTitle: {
    fontSize: scale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.Stext,
    textAlign: 'center',
    marginTop: 4,
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
    marginTop: 8,
  },
});