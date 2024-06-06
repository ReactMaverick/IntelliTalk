import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./Style";
import { FormInput } from "react-native-formtastic";
import { useState } from "react";
import { commonStyles } from "@/constants/styles";
import { platform } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { register } from "@/redux/reducers/authReducer";
import Loader from "@/components/Loader/Loader";
import { showToast } from "@/constants/constants";

export default function Register({ navigation }) {

    const dispatch = useDispatch();

    const [iSLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        dob: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        mobile: "",
        dob: "",
        password: "",
        confirmPassword: "",
    });

    const resetErrors = () => {
        let updatedErrors = {
            name: "",
            email: "",
            mobile: "",
            dob: "",
            password: "",
            confirmPassword: "",
        };
        setErrors(updatedErrors);
    };

    const handleSubmit = () => {
        let updatedErrors = {
            name: "",
            email: "",
            mobile: "",
            dob: "",
            password: "",
            confirmPassword: "",
        };

        if (!formData.name) {
            updatedErrors.name = 'Name is required';
            setErrors(updatedErrors);
            return;
        } else if (formData.name.length < 3) {
            updatedErrors.name = 'Name should be atleast 3 characters';
            setErrors(updatedErrors);
            return;
        } else if (!/^[a-zA-Z ]+$/.test(formData.name)) {
            updatedErrors.name = 'Name should contain only alphabets';
            setErrors(updatedErrors);
            return;
        } else if (formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            updatedErrors.email = 'Invalid email';
            setErrors(updatedErrors);
            return;
        } else if (!formData.mobile) {
            updatedErrors.mobile = 'Phone number is required';
            setErrors(updatedErrors);
            return;
        } else if (formData.mobile.length < 10) {
            updatedErrors.mobile = 'Phone number should be 10 digits';
            setErrors(updatedErrors);
            return;
        } else if (!/^[0-9]+$/.test(formData.mobile)) {
            updatedErrors.mobile = 'Phone number should contain only digits';
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
        } else if (!formData.confirmPassword) {
            updatedErrors.confirmPassword = 'Confirm password is required';
            setErrors(updatedErrors);
            return;
        } else if (formData.confirmPassword !== formData.password) {
            updatedErrors.confirmPassword = 'Passwords do not match';
            setErrors(updatedErrors);
            return;
        } else {
            // console.log('Form submitted successfully');

            setIsLoading(true);

            dispatch(register(formData))
                .then((res) => {
                    console.log('Response in .then of dispatch ==> ', res);

                    if (res.type === 'auth/register/fulfilled') {
                        // showToast('success', res.payload);
                        // console.log('Success');
                        if (res.payload.next === 'verifyOTP') {
                            navigation.navigate('VerifyOTP');
                        } else if (res.payload.next === 'login') {
                            navigation.navigate('Login');
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
                });

        }
    };

    if (iSLoading) {
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
                        <Text style={styles.title}>Register</Text>
                        <FormInput
                            placeholderText='Enter your name'
                            labelText='Name'
                            isRequired={true}
                            characterLimit={20}
                            value={formData.name}
                            onTextChange={(name) => {
                                setFormData({
                                    ...formData,
                                    name,
                                })
                                resetErrors();
                            }}
                            error={errors.name !== ''}
                            errorText={errors.name}
                            leftIcon='user'
                        />
                        <FormInput
                            labelText="Email"
                            placeholderText="Enter your email"
                            inputType="email-address"
                            leftIcon="envelope"
                            value={formData.email}
                            onTextChange={(email) => {
                                setFormData({ ...formData, email });
                                resetErrors();
                            }}
                            error={errors.email !== "" ? true : false}
                            errorText={errors.email}
                        />

                        <FormInput
                            placeholderText='Enter your mobile number'
                            labelText='Phone Number'
                            isRequired={true}
                            characterLimit={10}
                            inputType='numeric'
                            value={formData.mobile}
                            onTextChange={(mobile) => {
                                setFormData({
                                    ...formData,
                                    mobile,
                                });
                                resetErrors();
                            }}
                            error={errors.mobile !== ''}
                            errorText={errors.mobile}
                            leftIcon='phone'
                        />

                        <FormInput
                            // placeholderText='Re-enter your password'
                            labelText='Date of Birth'
                            isRequired={true}
                            error={errors.dob !== ''}
                            errorText={errors.dob}
                            leftIcon={'calendar'}
                            datePicker={true}
                            disableFutureDates={true}
                            datePlaceholder="Select your date of birth"
                            // onDateChange={(date) => {
                            //   console.log('Date ==> ', date);
                            // }}
                            sendDateValue={(dateValue) => {
                                console.log('Date Value ==> ', dateValue);

                                setFormData({
                                    ...formData,
                                    dob: dateValue,
                                });

                                resetErrors();
                            }}
                        />

                        <FormInput
                            labelText="Password"
                            isRequired={true}
                            placeholderText="Enter your password"
                            value={formData.password}
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

                        <FormInput
                            placeholderText='Re-enter your password'
                            labelText='Confirm Password'
                            isRequired={true}
                            value={formData.confirmPassword}
                            onTextChange={(confirmPassword) => {
                                setFormData({
                                    ...formData,
                                    confirmPassword,
                                });
                                resetErrors();
                            }}
                            error={errors.confirmPassword !== ''}
                            errorText={errors.confirmPassword}
                            leftIcon={isConfirmPasswordVisible ? 'unlock' : 'lock'}
                            rightIcon={isConfirmPasswordVisible ? 'eye' : 'eye-slash'}
                            hiddenText={!isConfirmPasswordVisible}
                            rightIconOnPress={() => {
                                setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
                            }}
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                handleSubmit();
                            }}
                        >
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>

                        <Text style={styles.registerLink}>Already have an account? <Text style={styles.link}
                            onPress={() => {
                                navigation.navigate('Login');
                            }}
                        >Login</Text></Text>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}