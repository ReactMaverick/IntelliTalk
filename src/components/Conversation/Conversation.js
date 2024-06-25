import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { ScrollView, Alert, View, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
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
import { addFemaleConversation, addFemaleMessage, addMaleConversation, addMaleMessage, chatWithAI, clearFemaleConversations, clearMaleConversations, selectAssistant, selectConversation, selectFemaleConversation, selectFemaleMessages, selectMaleConversation, selectMaleMessages, selectMessages, setAssistant } from '../../redux/reducers/conversationReducer';
import { colors } from '../../constants/colors';
import Tts from 'react-native-tts';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import AssistantSelector from '../AssistantSelector/AssistantSelector';

export const Conversation = React.memo(({ navigation }) => {

    const dispatch = useDispatch();

    const assistant = useSelector(selectAssistant);

    // console.log('Assistant ==> ', assistant);

    const conversations = useSelector(state => selectConversation(state, assistant));

    const messages = useSelector(state => selectMessages(state, assistant));

    // console.log('Conversation ==> ', conversations);

    // console.log('Messages ==> ', messages);

    // const [assistant, setAssistant] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [isInConversationMode, setIsInConversationMode] = useState(false);
    const [isAssistantSelectorVisible, setIsAssistantSelectorVisible] = useState(false);
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

    const [ttsStatus, setTtsStatus] = useState('initializing');

    useEffect(() => {
        if (userMicPermissionGranted) {

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

            Tts.addEventListener('tts-start', (event) => {
                // console.log('TTS Start ==> ', event);
                setTtsStatus('started');
            });

            Tts.addEventListener('tts-finish', (event) => {
                // console.log('TTS Finish ==> ', event);
                setTtsStatus('finished');
            });

            Tts.addEventListener('tts-cancel', (event) => {
                // console.log('TTS Cancel ==> ', event);
                setTtsStatus('cancelled');
            });
        }

    }, [userMicPermissionGranted]);

    const initTts = async () => {
        const voices = await Tts.voices();

        console.log('Voices ==> ', voices);

        const availableVoices = voices
            ?.filter((voice) => !voice.networkConnectionRequired && !voice.notInstalled)
            ?.map((voice) => {
                return { id: voice.id, name: voice.name, language: voice.language };
            });

        console.log('Available Voices ==> ', availableVoices);

        const availableEnglishVoices = availableVoices?.filter((voice) => voice.language.startsWith('en'));

        console.log('Available English Voices ==> ', availableEnglishVoices);

        let selectedVoice = null;

        // console.log('Voices ==> ', voices);

        if (availableEnglishVoices && availableEnglishVoices.length > 0) {
            selectedVoice = assistant === 'Jenny' ? availableEnglishVoices[0].id : availableEnglishVoices.find((voice) => voice.id === 'en-us-x-iom-local' || voice.id === 'en-au-x-aub-local').id;

            // console.log('Selected Voice ==> ', selectedVoice); //en-au-x-aub-local //en-us-x-iom-local male voices

            // try {
            //     await Tts.setDefaultLanguage(availableEnglishVoices[0].language);
            // } catch (err) {
            //     //Samsung S9 has always this error:
            //     //"Language is not supported"
            //     console.log(`setDefaultLanguage error `, err);
            // }

            await Tts.setDefaultVoice(selectedVoice);

            // Test TTS
            // Tts.speak('Hello, how are you?');

            setVoices(availableEnglishVoices);
            setSelectedVoice(selectedVoice);
        }
    };

    useEffect(() => {
        // dispatch(clearConversations());

        // dispatch(clearMaleConversations());
        // dispatch(clearFemaleConversations());

        setSpeechRecStartedHandler(() => {
            // console.log('👆 Speech Recognition Started!');
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
        // console.log("Assistant  ==> ", assistant);
        const setAssistantVoice = async () => {
            if (assistant && voices?.length > 0) {
                const assistantVoice = assistant === 'Jenny' ? voices[0].id : voices.find((voice) => voice.id === 'en-us-x-iom-local' || voice.id === 'en-au-x-aub-local').id;

                await Tts.setDefaultVoice(assistantVoice);

                // console.log('Assistant Voice ==> ', assistantVoice);
            }
        };

        setAssistantVoice();

    }, [assistant, voices]);

    useEffect(() => {
        setSpeechRecCompletedHandler(async (userChatMessage) => {
            if (conversationCancelledByUser.current) {
                return;
            }

            const trimmedMessage = userChatMessage.trim();

            if (trimmedMessage?.length > 0) {
                // console.log(
                //     '🎉 Speech Recognition Completed. Recognized Content: ',
                //     trimmedMessage,
                // );

                setChatMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        role: 'user',
                        content: trimmedMessage,
                    },
                ]);

                try {
                    // Send a request to the OpenAI API

                    // console.log("Assistant Before API Call ==> ", assistant);

                    if (assistant === null) {
                        return;
                    } else if (assistant === 'Jenny') {
                        dispatch(addFemaleConversation({
                            role: 'user',
                            content: trimmedMessage
                        }))

                        dispatch(addFemaleMessage({
                            role: 'user',
                            content: trimmedMessage
                        }))

                        setTimeout(() => {
                            dispatch(chatWithAI({
                                messages,
                                userMessage: {
                                    role: 'user',
                                    content: trimmedMessage
                                },
                                assistant
                            }))
                                .then((response) => {
                                    // console.log("Logic", response.type === 'conversation/chatWithAI/fulfilled');

                                    // console.log('Response ====================> ', response);

                                    if (response.type === 'conversation/chatWithAI/fulfilled') {
                                        const aiMessage = response.payload.response;

                                        // console.log('TTs Status ==> ', ttsStatus);

                                        Tts.stop();
                                        Tts.speak(aiMessage);

                                    }
                                })
                        }, 10);
                    } else if (assistant === 'John') {
                        dispatch(addMaleConversation({
                            role: 'user',
                            content: trimmedMessage
                        }))

                        dispatch(addMaleMessage({
                            role: 'user',
                            content: trimmedMessage
                        }))

                        setTimeout(() => {
                            dispatch(chatWithAI({
                                messages,
                                userMessage: {
                                    role: 'user',
                                    content: trimmedMessage
                                },
                                assistant
                            }))
                                .then((response) => {
                                    // console.log("Logic", response.type === 'conversation/chatWithAI/fulfilled');

                                    if (response.type === 'conversation/chatWithAI/fulfilled') {
                                        const aiMessage = response.payload.response;

                                        // console.log('TTs Status ==> ', ttsStatus);

                                        Tts.stop();
                                        Tts.speak(aiMessage);

                                    }
                                })
                        }, 10);
                    }

                } catch (error) {
                    console.error('Failed to fetch response from OpenAI: ', error);
                }


            } else {
                // console.log('🎉 Speech Recognition Completed. User spoke nothing. ');
            }
        });
    }, [setSpeechRecCompletedHandler, assistant, messages]);

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

    const getTtsStatus = useCallback((status) => {
        // console.log('Status ==> ', status, ttsStatus);
        switch (status) {
            case 'playVideo':
                if (ttsStatus === 'started') {
                    return true;
                } else {
                    return false;
                }
            case 'pauseVideo':
                if (ttsStatus === 'finished' || ttsStatus === 'cancelled' || ttsStatus === 'initializing') {
                    return true;
                } else {
                    return false;
                }
        }
    });

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                console.log('isAssistantSelectorVisible ==> ', isAssistantSelectorVisible);
                if (isAssistantSelectorVisible) {
                    setIsAssistantSelectorVisible(false);
                }
            }}
        >
            <SafeAreaView style={styles.container}>
                <>
                    {/* Drawer Close Icon */}
                    <View
                        style={styles.closeDrawer}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setIsAssistantSelectorVisible(false);
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

                    {/* Assistant Selector Button */}
                    {assistant &&
                        <AssistantSelector
                            containerStyle={styles.assistantSelectorContainer}
                            assistant={assistant}
                            setAssistant={setAssistant}
                            dispatch={dispatch}
                            assistantSelectorVisible={isAssistantSelectorVisible}
                            setAssistantSelectorVisible={setIsAssistantSelectorVisible}
                        />
                    }
                    {/* Assistant Selector Button */}

                    {assistant
                        ?
                        <>
                            <ScrollView
                                ref={scrollRef}
                                onContentSizeChange={handleTextAreaSizeChange}
                                style={styles.recognizedTextArea}
                            >
                                {speechRecContentArea}
                            </ScrollView>

                            {/* Video Player */}
                            <View style={styles.videoPlayerContainer}>
                                <VideoPlayer
                                    videoPlayerStyle={styles.videoPlayerStyle}
                                    playVideo={getTtsStatus('playVideo')}
                                    pauseVideo={getTtsStatus('pauseVideo')}
                                    assistant={assistant}
                                />
                            </View>
                            {/* Video Player */}

                            <ScrollView
                                ref={conversationScrollRef}
                                style={styles.chatArea}
                                onContentSizeChange={handleConversationSizeChange}
                                showsVerticalScrollIndicator={false}
                            >
                                {conversations?.map((message, index) => (
                                    <View key={index} style={[styles.chatBubble,
                                    { alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start' }
                                    ]}>
                                        <Text style={styles.chatMessage}>
                                            <Text style={styles.chatUser}>{message.role === 'user' ? 'You' : assistant}:</Text> {message.content}
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
                        </> :
                        // Select Assistant
                        <View style={styles.selectAssistantContainer}>
                            <Text
                                style={styles.selectAssistantHeaderText}
                            >
                                Select Your Assistant
                            </Text>

                            <View
                                style={styles.assistantButtonContainer}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(setAssistant('John'));
                                    }}
                                    style={styles.assistantButton}
                                >
                                    <View
                                        style={styles.assistantImageContainer}
                                    >
                                        <Image
                                            source={require('@/assets/images/male_assistant.png')}
                                            style={styles.assistantImage}
                                        />
                                    </View>
                                    <Text
                                        style={styles.assistantText}
                                    >John</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(setAssistant('Jenny'));
                                    }}
                                    style={styles.assistantButton}
                                >
                                    <View
                                        style={styles.assistantImageContainer}
                                    >
                                        <Image
                                            source={require('@/assets/images/female_assistant.png')}
                                            style={styles.assistantImage}
                                        />
                                    </View>
                                    <Text
                                        style={styles.assistantText}
                                    >Jenny</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
});

Conversation.displayName = 'Conversation';