import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
        height: '100%',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
    recognizedTextArea: {
        // height: '50%',
        paddingTop: 30,
        backgroundColor: 'red',
    },
    micContainer: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 50,
    },
});