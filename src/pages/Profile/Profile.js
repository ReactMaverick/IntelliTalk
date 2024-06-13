import { Image, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./Style";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { commonStyles } from "../../constants/styles";
import { platform, showToast } from "../../constants/constants";
import { FormInput } from "react-native-formtastic";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser, updateProfile } from "../../redux/reducers/authReducer";
import { useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader/Loader";
import { colors } from "../../constants/colors";
import { PROFILE_ADD, PROFILE_AVATAR, PROFILE_EDIT } from "../../constants/images";
import ActionSheet from "react-native-actions-sheet";
import { requestCameraPermission } from "../../common/common";
import ImageCropPicker from "react-native-image-crop-picker";
import { IMAGE_BASE_URL } from "../../values/api/url";

export default function Profile({ navigation }) {

    const user = useSelector(selectUser);

    const token = useSelector(selectToken);

    const actionSheetRef = useRef(null);

    const dispatch = useDispatch();

    // console.log('user ==> ', user);

    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        mobile: "",
        dob: "",
    });

    // const [profileImage, setProfileImage] = useState(null);
    const [profileImageURL, setProfileImageURL] = useState(null);

    const [isProfileImageUploading, setIsProfileImageUploading] = useState(false);

    const [editableFields, setEditableFields] = useState({
        email: false,
        name: false,
        mobile: false,
        dob: false,
    });
    const [errors, setErrors] = useState({
        email: "",
        name: "",
        mobile: "",
        dob: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email ?? "",
                name: user.name ?? "",
                mobile: user.mobile ?? "",
                dob: user.dob ?? "",
            });
            setProfileImageURL(user.image ? IMAGE_BASE_URL + user.image : null);
            setIsLoading(false);
        }
    }, [user]);

    const resetErrors = () => {
        const updatedErrors = {
            email: "",
            name: "",
            mobile: "",
            dob: "",
        };

        setErrors(updatedErrors);
    };

    // console.log('Errors ==> ', errors);

    const uploadImage = image => {
        if (image != undefined) {
            const file = {
                uri: image.path,
                name: image.path.split('/').pop(),
                type: 'image/jpeg',
            };

            setProfileImageURL(null);

            setIsProfileImageUploading(true);

            dispatch(updateProfile({ image: file, token, userId: user._id }))
                .then((response) => {
                    // console.log('response ==> ', response);
                })
                .catch((error) => {
                    // console.log('error ==> ', error);
                })
                .finally(() => {
                    setIsProfileImageUploading(false);
                });
        }
    };


    const handleOpenCamera = async () => {
        const hasCameraPermission = await requestCameraPermission();
        if (hasCameraPermission) {
            // Open the camera
            ImageCropPicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
            }).then(image => {
                actionSheetRef.current?.hide();
                uploadImage(image);
            }).catch(err => {
                showToast('error', err.message);
                // // // console.log('err ==> ', err);
            }).finally(() => {
                actionSheetRef.current?.hide();
                resetErrors();
            });
        } else {

            showToast('error', 'Camera permission was not granted');
            // Handle case where camera permission is not granted
            // // // console.log('Camera permission was not granted');
        }
    };

    // console.log('formData ==> ', formData);

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

                {isLoading ? <Loader /> :
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        style={styles.scrollView}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    >
                        <View>
                            {/* <Text style={styles.title}>Profile</Text> */}

                            {/* Profile Picture */}
                            <View style={styles.updateImgBox}>
                                {/* {console.log('profileImageURL ==> ', profileImageURL)} */}
                                <View
                                    style={styles.profileImageOuterView}
                                >
                                    <View
                                        style={styles.profileImageInnerView}
                                    >
                                        {profileImageURL ?
                                            <Image
                                                source={{ uri: profileImageURL }}
                                                style={styles.profileImage}
                                            /> : isProfileImageUploading ?
                                                <Loader /> :
                                                <Image
                                                    source={
                                                        PROFILE_AVATAR
                                                    }
                                                    style={styles.profileImage}
                                                />
                                        }
                                    </View>
                                </View>


                                <TouchableOpacity
                                    style={styles.updateImgBtn}
                                    onPress={() => {
                                        actionSheetRef.current?.show();
                                    }}
                                >
                                    {profileImageURL ?
                                        <Image source={PROFILE_EDIT} style={{ width: 30, height: 30 }} /> :
                                        <Image source={PROFILE_ADD} style={{ width: 30, height: 30 }} />
                                    }
                                </TouchableOpacity>
                            </View>

                            <ActionSheet
                                ref={actionSheetRef}
                                containerStyle={{
                                    backgroundColor: colors.BGColor,
                                }}>
                                <TouchableOpacity
                                    onPress={handleOpenCamera}
                                    style={[styles.outerBtn, {
                                        borderTopLeftRadius: 10,
                                        borderTopRightRadius: 10,
                                    }]}>
                                    <Text style={styles.btnText}>Take Picture</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        ImageCropPicker.openPicker({
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
                                    <Text style={styles.btnText}>Select Image</Text>
                                </TouchableOpacity>
                            </ActionSheet>
                            {/* Profile Picture */}

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

                            <FormInput
                                labelText="Date of Birth"
                                datePicker={true}
                                datePlaceholder="Select your date of birth"
                                leftIcon="calendar"
                                rightIcon="pencil"
                                value={formData.dob}
                                sendDateValue={(dob) => {
                                    console.log("dob ==> ", dob);
                                }}
                                disableFutureDates={true}
                                disabled={!editableFields.dob}
                                error={errors.dob !== "" ? true : false}
                                errorText={errors.dob}
                                leftIconColor={!editableFields.dob ? colors.lightGray : colors.darkGray}
                                rightIconOnPress={() => {
                                    setEditableFields({ ...editableFields, dob: !editableFields.dob });
                                }}
                            />
                        </View>

                    </ScrollView>
                }
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}