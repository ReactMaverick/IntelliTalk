import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { deviceHeight } from "../../constants/constants";

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
        maxHeight: '10%',
        width: '80%',
        paddingTop: 30,
        backgroundColor: 'red',
    },
    chatArea: {
        flex: 1,
        height: '50%',
        width: '100%',
        padding: 10,
        backgroundColor: 'blue',
        position: 'absolute',
        bottom: '10%',
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
        textTransform: 'capitalize',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 100,
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
    videoPlayerContainer: {
        width: '100%',
        height: deviceHeight / 3.7,
        borderRadius: 5,
        backgroundColor: colors.borderLightColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoPlayerStyle: {
        height: '100%',
        width: '96%',
        // backgroundColor: 'black',
    },
});