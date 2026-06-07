import { TouchableOpacity, Pressable, StyleSheet, Image, TextInput, View, Text, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { useAuth, useSignUp, useOAuth } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import BackgroundGlow from '@/components/BackgorundGlow';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');
const scale = (size: number) => (width / 390) * size;

export default function Page() {
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const { signUp, isLoaded: signUpLoaded, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google', redirectUrl: 'calispace://oauth-callback' });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [generalError, setGeneralError] = React.useState('');
  const [codeError, setCodeError] = React.useState('');
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const cooldownRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = () => {
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = () => {
    if (resendCooldown > 0) return;
    setCodeError('');
    signUp?.prepareEmailAddressVerification({ strategy: 'email_code' });
    startCooldown();
  };

  const handleGoogleSignUp = async () => {
    setGeneralError('');
    try {
      const result = await startOAuthFlow();
      const { createdSessionId, setActive: setActiveSession } = result;
      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId });
        router.replace('/(tabs)/Home');
      } else {
        setGeneralError('Google sign-up was cancelled or failed. Please try again.');
      }
    } catch {
      setGeneralError('Google sign-up failed. Verify your connection or Google credentials.');
    }
  };

  const handleSubmit = async () => {
    if (!signUpLoaded || !signUp) return;
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    try {
      await signUp.create({ emailAddress, password, ...(username ? { username } : {}) });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      startCooldown();
      setPendingVerification(true);
    } catch (err: any) {
      const errors = err?.errors || [];
      if (errors.length === 0) {
        setGeneralError(err?.message || 'An error occurred during account creation.');
        return;
      }
      errors.forEach((e: any) => {
        const message = e.longMessage || e.message;
        if (e.meta?.paramName === 'email_address') {
          setEmailError(message);
        } else if (e.meta?.paramName === 'password') {
          setPasswordError(message);
        } else {
          setGeneralError(message);
        }
      });
    }
  };

  const handleVerify = async () => {
    if (!signUpLoaded || !signUp || !setActive) return;
    setCodeError('');
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(tabs)/Home');
      }
    } catch (err: any) {
      const errors = err?.errors || [];
      errors.forEach((e: any) => setCodeError(e.longMessage || e.message));
    }
  };

  if (isSignedIn) return null;

  if (pendingVerification) {
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
            <Text style={styles.title}>Verify your account</Text>
            <Text style={styles.secondaryTitle}>Enter the code we sent to your email</Text>

            <Text style={styles.label}>Verification code</Text>
            <TextInput
              style={[styles.input, codeError ? styles.inputError : null]}
              value={code}
              placeholder="Enter your verification code"
              placeholderTextColor="#666666"
              onChangeText={(c) => { setCode(c); setCodeError(''); }}
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
              style={[styles.secondaryButton, resendCooldown > 0 && styles.secondaryButtonDisabled]}
              onPress={handleResendCode}
              disabled={resendCooldown > 0}
            >
              <Text style={[styles.secondaryButtonText, resendCooldown > 0 && styles.secondaryButtonTextDisabled]}>
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'I need a new code'}
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

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
            onChangeText={(email) => { setEmailAddress(email); setEmailError(''); }}
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
    marginBottom: 8,
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
    marginBottom: 4,
  },
  title: {
    fontSize: scale(26),
    fontFamily: 'Poppins-Bold',
    color: colors.Ptext,
    textAlign: 'center',
  },
  secondaryTitle: {
    fontSize: scale(13),
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
  secondaryButtonDisabled: {
    opacity: 0.4,
  },
  secondaryButtonText: {
    color: colors.Ptext,
    fontFamily: 'Poppins-SemiBold',
  },
  secondaryButtonTextDisabled: {
    color: '#666666',
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
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});