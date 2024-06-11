import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { styles } from './Style';

export default function AssistantSelector({
    containerStyle = {},
    assistant,
    setAssistant,
    dispatch,
}) {
    // Create a shared value for the animation
    const animation = useSharedValue(0);

    // Define the function to start the animation
    const startAnimation = () => {
        // Start the animation, moving the buttons up by 100 units over 500 milliseconds
        animation.value = withTiming(60, { duration: 500 });
    };

    // Define the function to stop the animation
    const stopAnimation = () => {
        // Stop the animation
        animation.value = withTiming(0, { duration: 500 });
    };

    // Define the function to toggle the animation
    const toggleAnimation = () => {
        // If the animation value is 0, start the animation
        if (animation.value === 0) {
            startAnimation();
        } else {
            // Otherwise, reset the animation value to 0
            stopAnimation();
        }
    };

    // Define the animated styles
    const animatedStyles = useAnimatedStyle(() => {
        return {
            // Translate the buttons along the Y axis according to the animation value
            transform: [{ translateY: animation.value }],
        };
    });

    console.log('assistant ==> ', assistant);

    return (
        <View
            style={containerStyle}
        >
            {/* The main image button */}
            <TouchableWithoutFeedback onPress={toggleAnimation}>
                <View style={styles.button}>
                    <Image
                        source={assistant === 'John' ? require('@/assets/images/male_assistant.png') : require('@/assets/images/female_assistant.png')}
                        style={styles.assistantImage}
                    />
                </View>
            </TouchableWithoutFeedback>
            {/* The second animated button */}
            <Animated.View style={[styles.animatedButton, animatedStyles]}>
                <TouchableOpacity onPress={
                    () => {
                        stopAnimation();
                        assistant === 'John' ? dispatch(setAssistant('Jenny')) : dispatch(setAssistant('John'))
                    }
                }>
                    <Image
                        source={assistant === 'Jenny' ? require('@/assets/images/male_assistant.png') : require('@/assets/images/female_assistant.png')}
                        style={styles.assistantImage}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}