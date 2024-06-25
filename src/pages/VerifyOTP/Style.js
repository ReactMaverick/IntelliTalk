import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.BGBlueColor,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.blueDarkColor,
    },
});