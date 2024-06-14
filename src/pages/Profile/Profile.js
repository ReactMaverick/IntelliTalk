import { ActivityIndicator, Image, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
import { convertToDate, requestCameraPermission } from "../../common/common";
import ImageCropPicker from "react-native-image-crop-picker";
import { IMAGE_BASE_URL } from "../../values/api/url";

export default function Profile({ navigation }) {

    const user = useSelector(selectUser);

    const token = useSelector(selectToken);

    const actionSheetRef = useRef(null);

    const dispatch = useDispatch();

    // console.log('user ==> ', user);

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        mobile: "",
        dob: "",
    });

    // const [profileImage, setProfileImage] = useState(null);
    const [profileImageURL, setProfileImageURL] = useState(null);

    const [isProfileImageUploading, setIsProfileImageUploading] = useState(false);

    const [isUpdateVisible, setIsUpdateVisible] = useState(false);

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

    const handleTextChange = (value, key) => {
        setFormData({ ...formData, [key]: value });
        resetErrors();
    };

    const handleUpdateProfile = () => {
        const updatedErrors = {
            email: "",
            name: "",
            mobile: "",
            dob: "",
        };

        if (!formData.name) {
            updatedErrors.name = "Name is required";
            setErrors(updatedErrors);
            return;
        } else if (formData.name.length < 3) {
            updatedErrors.name = 'Name should be at least 3 characters';
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
        } else if (!formData.email) {
            updatedErrors.email = "Email is required";
            setErrors(updatedErrors);
            return;
        } else if (!formData.mobile) {
            updatedErrors.mobile = "Mobile is required";
            setErrors(updatedErrors);
            return;
        } else if (!formData.dob) {
            updatedErrors.dob = "Date of Birth is required";
            setErrors(updatedErrors);
            return;
        } else {
            console.log('formData ==> ', formData);

            setIsUpdating(true);

            dispatch(updateProfile({
                ...formData,
                token,
                userId: user._id,
            }))
                .then((response) => {
                    // console.log('response ==> ', response);
                })
                .catch((error) => {
                    // console.log('error ==> ', error);
                })
                .finally(() => {
                    setIsUpdating(false);

                    setIsUpdateVisible(false);

                    setEditableFields({
                        email: false,
                        name: false,
                        mobile: false,
                        dob: false,
                    });

                    resetErrors();
                });
        }
    };

    // console.log('formData ==> ', formData);

    console.log('Update Visible ==> ', isUpdateVisible);

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
                                onTextChange={(name) => handleTextChange(name, "name")}
                                disabled={!editableFields.name}
                                error={errors.name !== "" ? true : false}
                                errorText={errors.name}
                                leftIconColor={!editableFields.name ? colors.lightGray : colors.darkGray}
                                rightIconOnPress={() => {
                                    setEditableFields({ ...editableFields, name: true });
                                    setIsUpdateVisible(true);
                                }}
                                inputContainerBackgroundColor={colors.lightGray}
                            />
                            <FormInput
                                labelText="Email"
                                placeholderText="Enter your email"
                                inputType="email-address"
                                leftIcon="envelope"
                                rightIcon="pencil"
                                value={formData.email}
                                onTextChange={(email) => handleTextChange(email, "email")}
                                disabled={!editableFields.email}
                                error={errors.email !== "" ? true : false}
                                errorText={errors.email}
                                leftIconColor={!editableFields.email ? colors.lightGray : colors.darkGray}
                                rightIconOnPress={() => {
                                    setEditableFields({ ...editableFields, email: true });
                                    setIsUpdateVisible(true);
                                }}
                                inputContainerBackgroundColor={colors.lightGray}
                            />

                            <FormInput
                                labelText="Mobile"
                                placeholderText="Enter your mobile number"
                                inputType="number-pad"
                                leftIcon="phone"
                                rightIcon="pencil"
                                value={formData.mobile}
                                onTextChange={(mobile) => handleTextChange(mobile, "mobile")}
                                characterLimit={10}
                                disabled={!editableFields.mobile}
                                error={errors.mobile !== "" ? true : false}
                                errorText={errors.mobile}
                                leftIconColor={!editableFields.mobile ? colors.lightGray : colors.darkGray}
                                rightIconOnPress={() => {
                                    setEditableFields({ ...editableFields, mobile: true });
                                    setIsUpdateVisible(true);
                                }}
                                inputContainerBackgroundColor={colors.lightGray}
                            />

                            <FormInput
                                labelText="Date of Birth"
                                datePicker={true}
                                // datePlaceholder="Select your date of birth"
                                leftIcon="calendar"
                                rightIcon="pencil"
                                initialDate={formData.dob ? convertToDate(formData.dob) : null}
                                sendDateValue={(dob) => handleTextChange(dob, "dob")}
                                disableFutureDates={true}
                                disabled={!editableFields.dob}
                                error={errors.dob !== "" ? true : false}
                                errorText={errors.dob}
                                leftIconColor={!editableFields.dob ? colors.lightGray : colors.darkGray}
                                rightIconOnPress={() => {
                                    setEditableFields({ ...editableFields, dob: true });
                                    setIsUpdateVisible(true);
                                }}
                                inputContainerBackgroundColor={colors.lightGray}
                            />

                            <TouchableOpacity
                                style={[styles.updateBtn, {
                                    opacity: isUpdateVisible ? 1 : 0.5,
                                    pointerEvents: isUpdateVisible ? 'auto' : 'none',
                                }]}
                                onPress={() => {
                                    isUpdateVisible &&
                                        handleUpdateProfile();
                                }}
                            >
                                <Text style={styles.updateBtnText}>
                                    {isUpdating ?
                                        <ActivityIndicator
                                            animating={isUpdating}
                                            color={colors.white}
                                            size="small"
                                        /> :
                                        'Update'
                                    }
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </ScrollView>
                }
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}