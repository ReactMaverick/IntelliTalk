import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import { H1 } from "../../constants/fontConstants";

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
    }
});