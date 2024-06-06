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
    disabledMicContainer: {
        opacity: 0.5,
    },
    micContainer: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 5,
    },
    micImage: {
        height: 140,
        resizeMode: 'contain',
    },
    recognizedTextArea: {
        maxHeight: '50%',
        paddingTop: 30,
    },
    chatArea: {
        flex: 1,
        width: '100%',
        padding: 10,
        // backgroundColor: '#f5f5f5',
    },
    chatBubble: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    chatMessage: {
        fontSize: 16,
        color: '#333',
    },
    chatUser: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 100,
    },
});