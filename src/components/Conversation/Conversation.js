import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { ScrollView, Alert, View, TouchableOpacity } from 'react-native';
import { RESULTS } from 'react-native-permissions';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpeechRecognition } from 'react-native-voicebox-speech-rec';
import { MicrophoneButton } from '../Microphone/MicrophoneButton';
import { MicrophoneButtonTooltip } from '../Microphone/MicrophoneButtonTooltip';
import { showToast } from '../../constants/constants';
import { useCheckSpeechRecPermissions, useRequestSpeechRecPermissions } from '../Microphone/speechRecPermissions';
import { styles } from './Style';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { addConversation, addMessage, chatWithAI, clearConversations, selectConversation, selectMessages } from '../../redux/reducers/conversationReducer';
import { colors } from '../../constants/colors';
import Tts from 'react-native-tts';

export const Conversation = React.memo(({ navigation }) => {

    const dispatch = useDispatch();

    const conversations = useSelector(selectConversation);

    const messages = useSelector(selectMessages);

    const [chatMessages, setChatMessages] = useState([]);
    const [isInConversationMode, setIsInConversationMode] = useState(false);
    const [userMicPermissionGranted, setUserMicPermissionGranted] =
        useState(false);

    /** ***************************************************************
     * Setup speech recognition
     *************************************************************** */
    const {
        startSpeechRecognition,
        stopSpeechRecognition,
        cancelSpeechRecognition,

        speechContentRealTime,

        setSpeechRecErrorHandler,
        setSpeechRecStartedHandler,
        setSpeechRecCompletedHandler,
    } = useSpeechRecognition();

    const conversationCancelledByUser = useRef(false);

    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);

    useEffect(() => {

        // Initialize TTS
        Tts.getInitStatus()
            .then(() => {
                initTts();
            }, (err) => {
                if (err.code === 'no_engine') {
                    Tts.requestInstallEngine();
                }
            });
        // Initialize TTS

    }, []);

    const initTts = async () => {
        const voices = await Tts.voices();
        const availableVoices = voices
            .filter((voice) => !voice.networkConnectionRequired && !voice.notInstalled)
            .map((voice) => {
                return { id: voice.id, name: voice.name, language: voice.language };
            });

        const availableEnglishVoices = availableVoices.filter((voice) => voice.language === 'en-US');

        console.log('Available English Voices ==> ', availableEnglishVoices);

        let selectedVoice = null;

        // console.log('Voices ==> ', voices);

        if (availableEnglishVoices && availableEnglishVoices.length > 0) {
            selectedVoice = availableEnglishVoices[0].id;

            console.log('Selected Voice ==> ', selectedVoice);

            // try {
            //     await Tts.setDefaultLanguage(availableEnglishVoices[0].language);
            // } catch (err) {
            //     //Samsung S9 has always this error:
            //     //"Language is not supported"
            //     console.log(`setDefaultLanguage error `, err);
            // }

            await Tts.setDefaultVoice(availableEnglishVoices[0].id);
            setVoices(availableEnglishVoices);
            setSelectedVoice(selectedVoice);
        }
    };

    useEffect(() => {
        // dispatch(clearConversations());

        setSpeechRecStartedHandler(() => {
            console.log('👆 Speech Recognition Started!');
        });
    }, [setSpeechRecStartedHandler]);

    useEffect(() => {
        setSpeechRecErrorHandler((errorMessage) => {
            Alert.alert(
                'Error in speech recognition',
                String(errorMessage),
                [
                    {
                        text: 'OK',
                        style: 'cancel',
                    },
                ],
                { cancelable: false },
            );
        });
    }, [setSpeechRecErrorHandler]);

    useEffect(() => {
        setSpeechRecCompletedHandler(async (userChatMessage) => {
            if (conversationCancelledByUser.current) {
                return;
            }

            const trimmedMessage = userChatMessage.trim();

            if (trimmedMessage.length > 0) {
                console.log(
                    '🎉 Speech Recognition Completed. Recognized Content: ',
                    trimmedMessage,
                );

                setChatMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        role: 'user',
                        content: trimmedMessage,
                    },
                ]);

                try {
                    // Send a request to the OpenAI API

                    dispatch(addConversation({
                        role: 'user',
                        content: trimmedMessage
                    }))

                    dispatch(addMessage({
                        role: 'user',
                        content: trimmedMessage
                    }))

                    setTimeout(() => {
                        dispatch(chatWithAI({
                            messages,
                            userMessage: {
                                role: 'user',
                                content: trimmedMessage
                            }
                        }))
                            .then((response) => {
                                console.log("Logic", response.type === 'conversation/chatWithAI/fulfilled');

                                if (response.type === 'conversation/chatWithAI/fulfilled') {
                                    const aiMessage = response.payload;

                                    // console.log('TTs Status ==> ', ttsStatus);

                                    Tts.stop();
                                    Tts.speak(aiMessage);

                                }
                            })
                    }, 10);

                } catch (error) {
                    console.error('Failed to fetch response from OpenAI: ', error);
                }


            } else {
                console.log('🎉 Speech Recognition Completed. User spoke nothing. ');
            }
        });
    }, [setSpeechRecCompletedHandler]);

    /** ********************************************************
     * Handle asking for speech recognition permission
     ******************************************************** */
    const askForPermission = useRequestSpeechRecPermissions();
    const checkForPermission = useCheckSpeechRecPermissions();

    useEffect(() => {
        checkForPermission().then(permissionCheckResult => {
            setUserMicPermissionGranted(permissionCheckResult === RESULTS.GRANTED);
        });
    }, [checkForPermission]);

    // useEffect(() => {
    //     if (conversations.length > 0) {
    //         const lastMessage = conversations[conversations.length - 1];
    //         if (lastMessage.role === 'system') {
    //             console.log('AI Response ==> ', lastMessage.content);

    //             if (ttsStatus === 'initialized') {
    //                 Tts.stop();
    //                 Tts.speak(lastMessage.content);
    //             }
    //         }
    //     }
    // }, [conversations]);

    const checkAndAskForPermission = useCallback(async () => {
        const permissionCheckResult = await checkForPermission();
        if (permissionCheckResult === RESULTS.GRANTED) {
            return true;
        }

        const requestResult = await askForPermission();
        if (requestResult === RESULTS.GRANTED) {
            setUserMicPermissionGranted(true);
            return true;
        } else {
            return false;
        }
    }, [askForPermission, checkForPermission]);

    /** ********************************************************
     * Handle start / stop user speak mode (i.e., start voice rec)
     ******************************************************** */
    const handleConversationButtonPressed = useCallback(async () => {
        const permissionGranted = await checkAndAskForPermission();
        if (!permissionGranted) {
            return;
        }

        conversationCancelledByUser.current = false;

        setIsInConversationMode(true);

        startSpeechRecognition();
    }, [checkAndAskForPermission, startSpeechRecognition]);

    const handleConversationButtonReleased = useCallback(() => {
        if (!isInConversationMode) {
            return;
        }

        setIsInConversationMode(false);

        stopSpeechRecognition();
    }, [isInConversationMode, stopSpeechRecognition]);

    const handleConversationButtonSwipedUp = useCallback(async () => {
        if (isInConversationMode) {
            conversationCancelledByUser.current = true;

            setIsInConversationMode(false);
            cancelSpeechRecognition();

            showToast('info', 'Speech recognition cancelled by user');
        }
    }, [cancelSpeechRecognition, isInConversationMode]);

    const scrollRef = useRef(null);
    const handleTextAreaSizeChange = useCallback(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
    }, []);

    const conversationScrollRef = useRef(null);
    const handleConversationSizeChange = useCallback(() => {
        conversationScrollRef.current?.scrollToEnd({ animated: true });
    }, []);

    const speechRecContentArea = useMemo(() => {
        return <Text variant="bodyMedium">{speechContentRealTime}</Text>;
    }, [speechContentRealTime]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Drawer Close Icon */}
            <View
                style={styles.closeDrawer}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.toggleDrawer();
                    }}
                    style={styles.closeDrawerButton}
                >
                    <Icon
                        name="menu"
                        type='MaterialIcons'
                        style={styles.closeDrawerIcon}
                    />
                </TouchableOpacity>
            </View>
            {/* Drawer Close Icon */}

            <ScrollView
                ref={scrollRef}
                onContentSizeChange={handleTextAreaSizeChange}
                style={styles.recognizedTextArea}
            >
                {speechRecContentArea}
            </ScrollView>

            <ScrollView
                ref={conversationScrollRef}
                style={styles.chatArea}
                onContentSizeChange={handleConversationSizeChange}
                showsVerticalScrollIndicator={false}
            >
                {conversations.map((message, index) => (
                    <View key={index} style={[styles.chatBubble,
                    { alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start' }
                    ]}>
                        <Text style={styles.chatMessage}>
                            <Text style={styles.chatUser}>{message.role === 'user' ? 'You' : 'Assistant'}:</Text> {message.content}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
                style={styles.gradient}
            />

            <MicrophoneButton
                containerStyle={styles.micContainer}
                disabled={false}
                handleButtonPressed={handleConversationButtonPressed}
                handleButtonReleased={handleConversationButtonReleased}
                handleButtonSwipeUp={handleConversationButtonSwipedUp}
                isInListeningMode={isInConversationMode}
                tooltipText={
                    <MicrophoneButtonTooltip
                        userIsSpeaking={isInConversationMode}
                        userMicPermissionBlocked={userMicPermissionGranted === false}
                    />
                }
            />
        </SafeAreaView>
    );
});

Conversation.displayName = 'Conversation';