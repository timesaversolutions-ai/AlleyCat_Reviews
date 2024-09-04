import React, { useEffect, useState } from 'react';
import { Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import { auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from '../firebase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState([]);
    const [password, setPassword] = useState([]);
    const [user, setUser] = useState(null); 

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          if (user) {
            navigation.replace('HomeScreen')
          }
        })
    
        return unsubscribe
    }, [])

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
          .then(userCredentials => {
            const user = userCredentials.user;
            <Text> Thank you for signing up. Confirm your email address here: {auth.currentUser?.email} </Text>
            console.log('Registered with:', user.email);
          })
          .catch(error => alert(error.message));
    };

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
          .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Logged in with:', user.email);
          })
          .catch(error => alert(error.message));
    };
      
    return (
        <KeyboardAvoidingView
          style={styles.container}
        >
          <Text
            style={{ fontSize: 26, fontWeight: 'bold', paddingBottom: 15 }}>
                Sign In or Register
            </Text>
          <View>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>
    
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSignUp}
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Register</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen;

