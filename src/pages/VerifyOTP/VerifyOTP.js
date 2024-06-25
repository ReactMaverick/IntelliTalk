import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { styles } from "./Style";
import { useDispatch, useSelector } from "react-redux";
import { selectNext, selectUser, verifyOTP } from "../../redux/reducers/authReducer";
import Loader from "../../components/Loader/Loader";
import { OneTapInput, ResendOTPButton } from "react-native-onetapinput";
import { colors } from "../../constants/colors";

export default function VerifyOTP({ navigation }) {

    const dispatch = useDispatch();

    const user = useSelector(selectUser);

    const next = useSelector(selectNext);

    const [hash, setHash] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState({
        otp: '',
    });

    useEffect(() => {
        if (next === 'login') {
            console.log('Next in useEffect VerifyOTP ==> ', next);
            navigation.navigate('Login');
        }
    }, [next]);

    // console.log('User: ', user);

    const submitOtp = (otp) => {
        console.log('OTP: ', otp);
        setIsLoading(true);
        dispatch(verifyOTP({ mobile: user.mobile, otp }))
            .then((response) => {
                if (response.error) {
                    setError({
                        otp: response.payload.message,
                    });
                    return;
                }
            })
            .catch((err) => {
                console.log('Error: ', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    if (isLoading) {
        return <Loader />;
    }


    return (
        <View style={styles.container}>
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: colors.blueDarkColor
                }}
            >
                Verify OTP
            </Text>

            <OneTapInput
                // otpCount={8}
                handleOtpChange={(otp) => {
                    setError({
                        otp: '',
                    });
                }}
                getFinalOtp={submitOtp}
                getHashCode={(hash) => {
                    console.log('Hash code ===> ', hash);
                    // setHash(hash); // The hash to be used in the SMS receiver app format: <#> Your Otp is is: 123ABC78. Use this code to log in. D2GX4obkbds <#>
                }}
                // hiddenText={true}
                // hiddenTextSymbol="*"
                error={error.otp ? true : false}
                errorText={error.otp}
            // otpBoxStyle={{
            //     width: 40,
            //     height: 40,
            //     borderWidth: 1,
            //     borderRadius: 20,
            //     justifyContent: 'center',
            //     alignItems: 'center',
            // }}
            // otpTextStyle={{
            //     fontSize: 12,
            // }}
            // otpBoxBorderColor="blue"
            // otpContainerStyle={{
            //     flexDirection: 'row',
            //     justifyContent: 'center',
            //     alignItems: 'center',
            //     gap: 5,
            // }}
            // cursorPosition={{
            //     left: 5,
            //     top: 5,
            // }}
            />
            <ResendOTPButton
                onResendOtp={() => {
                    // console.log('Resend OTP');
                }}
                intervalTime={10}
            // timerUnit="minutes"
            // resendButtonColor="red"
            // resendButtonTextColor="red"
            // resendText={(timer) => `Please wait ${timer} seconds before resending.`}
            // resendButtonStyle={{
            //     marginTop: 20,
            //     marginBottom: 20,
            // }}
            // resendButtonTextStyle={{
            //     color: colors.primary,
            //     fontSize: 16,
            // }}
            // disabledButtonStyle={{
            //     display: 'none',
            // }}
            />
        </View>
    );
}