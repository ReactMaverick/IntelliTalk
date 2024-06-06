import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { ScrollView, Alert, View } from 'react-native';
import { RESULTS } from 'react-native-permissions';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpeechRecognition } from 'react-native-voicebox-speech-rec';
import { MicrophoneButton } from '../Microphone/MicrophoneButton';
import { MicrophoneButtonTooltip } from '../Microphone/MicrophoneButtonTooltip';
import { showToast } from '../../constants/constants';
import { useCheckSpeechRecPermissions, useRequestSpeechRecPermissions } from '../Microphone/speechRecPermissions';
import { styles } from './Style';
import LinearGradient from 'react-native-linear-gradient';
import { OPENAI_API_KEY } from '../../common/common';
import { useDispatch, useSelector } from 'react-redux';
import { addConversation, chatWithAI, selectConversation, selectMessages } from '../../redux/reducers/conversationReducer';

export const Conversation = React.memo(() => {

    const dispatch = useDispatch();

    const conversations = useSelector(selectConversation);

    const messages = useSelector(selectMessages);

    console.log('Conversations ==> ', conversations);

    console.log('Messages ==> ', messages);

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

    useEffect(() => {
        setSpeechRecStartedHandler(() => {
            console.log('👆 Speech Recgnition Started!');
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

                    setTimeout(() => {
                        dispatch(chatWithAI({
                            messages,
                            userMessage: {
                                role: 'user',
                                content: trimmedMessage
                            }
                        }))
                    }, 10);


                    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //         Authorization: `Bearer ${OPENAI_API_KEY}`,
                    //     },
                    //     body: JSON.stringify({
                    //         model: 'gpt-3.5-turbo',
                    //         messages: [
                    //             {
                    //                 role: 'system',
                    //                 content: 'You are a helpful assistant that can check grammar and provide training.'
                    //             },
                    //             {
                    //                 role: 'user',
                    //                 content: trimmedMessage
                    //             }
                    //         ],
                    //         temperature: 0.7,
                    //     }),
                    // });

                    // console.log('Response from OpenAI: ', response);

                    // if (!response.ok) {
                    //     console.error('Failed to fetch response from OpenAI: ', response.statusText);
                    //     return;
                    // }

                    // const data = await response.json();

                    // // Add the AI's response to the chat messages
                    // setChatMessages((prevMessages) => [
                    //     ...prevMessages,
                    //     {
                    //         message: data.choices[0].message.content,
                    //         sender: 'ai',
                    //     },
                    // ]);
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

    const scrollRef = React.useRef(null);
    const handleTextAreaSizeChange = useCallback(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
    }, []);

    const speechRecContentArea = useMemo(() => {
        return <Text variant="titleLarge">{speechContentRealTime}</Text>;
    }, [speechContentRealTime]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                ref={scrollRef}
                onContentSizeChange={handleTextAreaSizeChange}
                style={styles.recognizedTextArea}
            >
                {speechRecContentArea}
            </ScrollView>

            <ScrollView
                style={styles.chatArea}
                showsVerticalScrollIndicator={false}
            >
                {conversations.map((message, index) => (
                    <View key={index} style={[styles.chatBubble,
                    { alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start' }
                    ]}>
                        <Text style={styles.chatMessage}>
                            <Text style={styles.chatUser}>{message.role}:</Text> {message.content}
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