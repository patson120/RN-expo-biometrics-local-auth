

import { View, Text, SafeAreaView, Alert, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'

import * as LocalAuthentication from 'expo-local-authentication'

const Home = () => {

    const [isBiometricSupported, setisBiometricSupported] = useState(false)
    const fallBackToLocalAuth = () => {
        console.log("Fall back to local auth")
    }
    const alertComponent = (title: string,
        message: string,
        btnTxt: string,
        btnFunc?: () => void) => {
        return Alert.alert(title, message,
            [
                {
                    text: btnTxt,
                    onPress: btnFunc
                }
            ]
        )
    }
    const twoButtonsAlert = () => {
        Alert.alert(
            'You are logged in',
            'Subscribe now @test.com',
            [
                {
                    text: 'Back',
                    onPress: () => console.log("Cancel pressed!"),
                    style: "cancel"
                },
                {
                    text: 'PROCEED',
                    onPress: () => console.log('OK Pressed')
                },
            ],
            { cancelable: false }
        );
    }

    const handleBiometricAuth = async () => {
        const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync()
        if (!isBiometricAvailable) {
            return alertComponent(
                'Please enter your password',
                'Biometric Auth not supported',
                'OK',
                () => fallBackToLocalAuth()
            )
        }
        let supportedBiometrics
        if (isBiometricAvailable) {
            supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync()
            console.log(JSON.stringify(supportedBiometrics , null, 2))
            
        }
        const savedBiometrics = await LocalAuthentication.isEnrolledAsync()
        if (!savedBiometrics) {
            return alertComponent(
                'Biometric record not found',
                'Please login with your password',
                'OK',
                () => fallBackToLocalAuth()
            )
        }
        const biometricAuth = await LocalAuthentication.authenticateAsync({
            promptMessage: "Login to @test.com app with biometrics",
            cancelLabel: "Cancel",
            disableDeviceFallback: true
        })
        if (biometricAuth.success) {
            twoButtonsAlert()
        }
    }

    useEffect(() => {
        (
            async () => {
                const compatible = await LocalAuthentication.hasHardwareAsync()
                setisBiometricSupported(compatible)
            }
        )
    }, [])


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text> 
                    {" "}
                    {
                        isBiometricSupported ?
                        "Your device is compatible biometrics" :
                        "Face or fingerprint is available on this device"
                    }
                </Text>

                <Pressable
                    onPress={handleBiometricAuth}
                    style={{
                        borderWidth: 1,
                        borderColor: '#007bff',
                        paddingHorizontal: 20,
                        paddingVertical: 6,
                        borderRadius: 10,
                        marginBottom: 10,
                        marginTop: 20
                    }}>
                    <Text style={{ fontSize: 20, color: '#007bff' }}>
                        Finger
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView >
    )
}

export default Home