import { Image, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./Style";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { commonStyles } from "../../constants/styles";
import { platform } from "../../constants/constants";
import { FormInput } from "react-native-formtastic";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/reducers/authReducer";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import { colors } from "../../constants/colors";
import { PROFILE_ADD, PROFILE_AVATAR } from "../../constants/images";

export default function Profile({ navigation }) {

    const user = useSelector(selectUser);

    console.log('user ==> ', user);

    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        mobile: "",
    });
    const [editableFields, setEditableFields] = useState({
        email: false,
        name: false,
        mobile: false,
    });
    const [errors, setErrors] = useState({
        email: "",
        name: "",
        mobile: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email,
                name: user.name,
                mobile: user.mobile,
            });
            setIsLoading(false);
        }
    }, [user]);

    const resetErrors = () => {
        const updatedErrors = {
            email: "",
            name: "",
            mobile: "",
        };

        setErrors(updatedErrors);
    };

    console.log('Errors ==> ', errors);

    return (
        <KeyboardAvoidingView
            behavior={platform === "ios" ? "padding" : "height"}
            style={commonStyles.keyboardAvoidingView}
        >
            <SafeAreaView style={styles.container}>
                {/* Drawer Close Icon */}
                <View
                    style={styles.closeDrawer}
                >
                    <TouchableOpacity
                        onPress={() => {
                            navigation.toggleDrawer();
                        }}
                        style={styles.closeDrawerButton}
                    >
                        <Icon
                            name="menu"
                            type='MaterialIcons'
                            style={styles.closeDrawerIcon}
                        />
                    </TouchableOpacity>
                </View>
                {/* Drawer Close Icon */}

                {/* Profile Picture */}
                <View style={styles.updateImgBox}>
                    <Image source={
                        PROFILE_AVATAR
                    }
                        style={{ width: 120, height: 120, borderRadius: 100 }} />

                    <TouchableOpacity
                        style={styles.updateImgBtn}
                        onPress={() => {
                            // actionSheetRef.current?.show();
                        }}
                    >
                        <Image source={PROFILE_ADD} style={{ width: 45, height: 45 }} />
                    </TouchableOpacity>
                </View>

                {/* <ActionSheet
                    ref={actionSheetRef}
                    containerStyle={{
                        backgroundColor: commonColor.backGroundColor,
                    }}>
                    <TouchableOpacity
                        onPress={handleOpenCamera}
                        style={[styles.outerBtn, { marginTop: 10 }]}>
                        <AvenirBookText style={styles.btnText}>Take Picture</AvenirBookText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            ImagePicker.openPicker({
                                width: 300,
                                height: 300,
                                cropping: true,
                            }).then(image => {
                                actionSheetRef.current?.hide();
                                uploadImage(image);
                            }).catch(err => {
                                // // // console.log('err ==> ', err);
                                showToast('error', err.message)
                            }).finally(() => {
                                actionSheetRef.current?.hide();
                            });
                        }}
                        style={styles.outerBtn}>
                        <AvenirBookText style={styles.btnText}>Select Image</AvenirBookText>
                    </TouchableOpacity>
                </ActionSheet> */}
                {/* Profile Picture */}

                {isLoading ? <Loader /> :
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        style={styles.scrollView}
                    >
                        <View>
                            <Text style={styles.title}>Profile</Text>
                            <FormInput
                                labelText="Name"
                                placeholderText="Enter your name"
                                leftIcon="user"
                                rightIcon="pencil"
                                value={formData.name}
                                onTextChange={(name) => {
                                    setFormData({ ...formData, name });
                                    resetErrors();
                                }}
                                disabled={!editableFields.name}
                                error={errors.name !== "" ? true : false}
                                errorText={errors.name}
                                leftIconColor={!editableFields.name ? colors.lightGray : colors.darkGray}
                                rightIconOnPress={() => {
                                    setEditableFields({ ...editableFields, name: !editableFields.name });
                                }}
                            />
                            <FormInput
                                labelText="Email"
                                placeholderText="Enter your email"
                                inputType="email-address"
                                leftIcon="envelope"
                                rightIcon="pencil"
                                value={formData.email}
                                onTextChange={(email) => {
                                    setFormData({ ...formData, email });
                                    resetErrors();
                                }}
                                disabled={!editableFields.email}
                                error={errors.email !== "" ? true : false}
                                errorText={errors.email}
                                leftIconColor={!editableFields.email ? colors.lightGray : colors.darkGray}
                                rightIconOnPress={() => {
                                    setEditableFields({ ...editableFields, email: !editableFields.email });
                                }}
                            />

                            <FormInput
                                labelText="Mobile"
                                placeholderText="Enter your mobile number"
                                inputType="number-pad"
                                leftIcon="phone"
                                rightIcon="pencil"
                                value={formData.mobile}
                                onTextChange={(mobile) => {
                                    setFormData({ ...formData, mobile });
                                    resetErrors();
                                }}
                                characterLimit={10}
                                disabled={!editableFields.mobile}
                                error={errors.mobile !== "" ? true : false}
                                errorText={errors.mobile}
                                leftIconColor={!editableFields.mobile ? colors.lightGray : colors.darkGray}
                                rightIconOnPress={() => {
                                    setEditableFields({ ...editableFields, mobile: !editableFields.mobile });
                                }}
                            />
                        </View>

                    </ScrollView>
                }
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}