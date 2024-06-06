import { StyleSheet } from "react-native";
import { H1, p, deviceHeight } from "@/constants/fontConstants";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
        minHeight: deviceHeight,
    },
    title: {
        fontSize: H1,
        fontWeight: '600',
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: {
        color: colors.white,
        fontSize: p,
        fontWeight: '600',
    },
    registerLink: {
        marginTop: 20,
        fontSize: p,
    },
    link: {
        color: colors.primary,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});