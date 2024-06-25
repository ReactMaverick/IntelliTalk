import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { deviceHeight } from "../../constants/constants";
import { H1, H2, H6, p } from "../../constants/fontConstants";

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.BGBlueColor,
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
        // backgroundColor: 'red',
    },
    chatArea: {
        flex: 1,
        height: '50%',
        width: '100%',
        padding: 10,
        // backgroundColor: 'blue',
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
        borderWidth: 1,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: colors.lightGray,
    },
    closeDrawerIcon: {
        fontSize: 30,
        color: colors.lightGray,
    },
    videoPlayerContainer: {
        width: '100%',
        height: deviceHeight / 4,
        borderRadius: 3,
        backgroundColor: colors.darkColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoPlayerStyle: {
        height: '100%',
        width: '98%',
        // backgroundColor: 'black',
    },
    selectAssistantContainer: {
        width: '100%',
        height: '100%',
        // backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
    },
    selectAssistantHeaderText: {
        fontSize: H1,
        fontWeight: 'bold',
        color: colors.blueDarkColor,
    },
    assistantButton: {
        // backgroundColor: colors.inputShadow,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        gap: 5,
    },
    assistantImageContainer: {
        height: 85,
        width: 85,
        borderRadius: 50,
        backgroundColor: colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    assistantImage: {
        height: 80,
        width: 80,
        resizeMode: 'contain',
        borderRadius: 50,

    },
    assistantButtonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    assistantText: {
        fontSize: p,
        color: colors.blueDarkColor,
    },
    assistantSelectorContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    }
});