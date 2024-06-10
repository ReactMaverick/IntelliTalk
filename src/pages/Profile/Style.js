import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
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
    },
    closeDrawerIcon: {
        fontSize: 30,
        color: colors.lightGray,
    },
});