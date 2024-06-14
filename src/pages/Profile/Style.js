import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import { H1 } from "@/constants/fontConstants";

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.BGBlueColor,
        height: '100%',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    closeDrawer: {
        position: 'absolute',
        top: 5,
        left: 5,
        height: 50,
    },
    closeDrawerButton: {
        backgroundColor: colors.inputShadow,
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: colors.lightGray,
    },
    closeDrawerIcon: {
        fontSize: 30,
        color: colors.lightGray,
    },
    title: {
        fontSize: H1,
        fontWeight: '600',
        alignSelf: 'center',
    },
    scrollView: {
        width: '100%',
        height: '100%',
        // backgroundColor: 'red'
    },
    updateImgBox: {
        position: 'relative',
        width: 120,
        // backgroundColor: colors.lightGray,
        alignSelf: 'center',
    },
    updateImgBtn: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: colors.lightGray,
        borderRadius: 100,
    },
    outerBtn: {
        paddingVertical: 15,
        backgroundColor: colors.BGBlueColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.3,
        borderBottomColor: colors.lightGray,
    },
    btnText: {
        color: colors.darkGrey,
        // fontSize: 16,
        fontWeight: '600',
    },
    profileImageOuterView: {
        width: 125,
        height: 125,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.blueDarkColor
    },
    profileImageInnerView: {
        width: 120,
        height: 120,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.borderLightColor
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 100
    },
    updateBtn: {
        paddingVertical: 15,
        backgroundColor: colors.blueDarkColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: 150,
        alignSelf: 'center',
        marginTop: 20,
    },
    updateBtnText: {
        color: colors.white,
        // fontSize: 16,
        fontWeight: '600',
    },
});