import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./Style";
import { FormInput } from "react-native-formtastic";
import { useEffect, useState } from "react";
import { commonStyles } from "@/constants/styles";
import { platform } from "@/constants/constants";
import { login, selectNext } from "../../redux/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
import { colors } from "../../constants/colors";

export default function Login({ navigation }) {
    const dispatch = useDispatch();
    const next = useSelector(selectNext);
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const resetErrors = () => {
        let updatedErrors = {
            email: '',
            password: '',
        };
        setErrors(updatedErrors);
    };

    useEffect(() => {
        console.log('Next in useEffect ==> ', next);
        if (next === 'verifyOTP') {
            navigation.navigate('VerifyOTP');
        }
    }, [next]);

    const handleSubmit = () => {
        let updatedErrors = {
            email: '',
            password: '',
        };

        if (!formData.email) {
            updatedErrors.email = 'Email is required';
            setErrors(updatedErrors);
            return;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            updatedErrors.email = 'Invalid email';
            setErrors(updatedErrors);
            return;
        } else if (!formData.password) {
            updatedErrors.password = 'Password is required';
            setErrors(updatedErrors);
            return;
        } else if (formData.password.length < 6) {
            updatedErrors.password = 'Password should be atleast 6 characters';
            setErrors(updatedErrors);
            return;
        } else {
            // console.log('Form submitted successfully');

            setIsLoading(true);

            dispatch(login(formData))
                .then((res) => {
                    console.log('Response in .then of dispatch ==> ', res);

                    if (res.type === 'auth/login/fulfilled') {
                        // showToast('success', res.payload);
                        // console.log('Success');
                        if (res.payload.next === 'verifyOTP') {
                            navigation.navigate('VerifyOTP');
                        }

                    } else {
                        // console.log('Error');
                        // showToast('error', res.payload);
                    }

                })
                .catch((err) => {
                    // console.log('Error ==> ', err);
                })
                .finally(() => {
                    // console.log('Finally');
                    setIsLoading(false);

                    setFormData({
                        email: '',
                        password: '',
                    });

                });
        }
    };

    if (isLoading) {
        return (
            <Loader />
        );
    }


    return (
        <KeyboardAvoidingView
            behavior={platform === "ios" ? "padding" : "height"}
            style={commonStyles.keyboardAvoidingView}
        >
            <SafeAreaView>
                <ScrollView
                    style={commonStyles.bg}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        <Text style={styles.title}>Login</Text>
                        <FormInput
                            labelText="Email"
                            isRequired={true}
                            placeholderText="Enter your email"
                            inputType="email-address"
                            leftIcon="envelope"
                            value={formData.email}
                            inputTextColor={colors.blueDarkColor}
                            onTextChange={(email) => {
                                setFormData({ ...formData, email });
                                resetErrors();
                            }}
                            error={errors.email !== "" ? true : false}
                            errorText={errors.email}
                        />

                        <FormInput
                            labelText="Password"
                            isRequired={true}
                            placeholderText="Enter your password"
                            value={formData.password}
                            inputTextColor={colors.blueDarkColor}
                            onTextChange={(password) => {
                                setFormData({ ...formData, password });
                                resetErrors();
                            }}
                            leftIcon={isPasswordVisible ? 'unlock' : 'lock'}
                            rightIcon={isPasswordVisible ? 'eye' : 'eye-slash'}
                            hiddenText={!isPasswordVisible}
                            error={errors.password !== "" ? true : false}
                            errorText={errors.password}
                            rightIconOnPress={() => {
                                setIsPasswordVisible(!isPasswordVisible);
                            }}
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                handleSubmit();
                            }}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>

                        <Text style={styles.registerLink}>Don't have an account? <Text style={styles.link}
                            onPress={() => {
                                navigation.navigate('Register');
                            }}
                        >Register</Text></Text>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}