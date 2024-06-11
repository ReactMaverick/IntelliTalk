import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

export const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 3,
        width: 55,
        height: 55,
        borderRadius: 50,
        backgroundColor: colors.darkColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 2,
        width: 55,
        height: 55,
        borderRadius: 50,
        backgroundColor: colors.darkColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    assistantImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
});