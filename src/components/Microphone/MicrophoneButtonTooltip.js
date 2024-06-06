/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Linking } from 'react-native';
import { Text } from 'react-native-paper';


export const MicrophoneButtonTooltip = React.memo(
  ({
    userIsSpeaking,
    userMicPermissionBlocked,
  }) => {
    if (userIsSpeaking) {
      return (
        <Text variant="bodyLarge" style={{ color: '#FFFFFFF' }}>
          Swipe up to cancel the conversation
        </Text>
      );
    }

    if (userMicPermissionBlocked) {
      return (
        <Text
          variant="bodyLarge"
          onPress={() => {
            Linking.openSettings();
          }}
          style={{ color: '#FFFFFF' }}>
          To talk to the app, please click to enable the Speech Recognition
          permission in your system settings.
        </Text>
      );
    }

    return (
      <Text variant="bodyLarge" style={{ color: '#FFFFFF' }}>
        Hold to speak, release to stop.
      </Text>
    );
  },
);
