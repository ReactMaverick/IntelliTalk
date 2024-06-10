import Video from 'react-native-video';
import { styles } from './Style';
import { useEffect, useRef } from 'react';

export default function VideoPlayer({ videoPlayerStyle, playVideo, pauseVideo }) {
    const videoRef = useRef(null);
    const aiVideo = require('../../assets/video/ai_female.mp4');

    useEffect(() => {
        console.log('videoRef.current ==> ', videoRef.current);
        if (playVideo) {
            if (!videoRef.current) {
                return;
            }

            const randomTime = Math.floor(Math.random() * 10) + 1;
            videoRef.current.seek(randomTime);
            videoRef.current.resume();
        } else if (pauseVideo) {
            if (!videoRef.current) {
                return;
            }

            videoRef.current.pause();
        }
    }, [playVideo, pauseVideo, videoRef]);

    const onBuffer = ({ isBuffering }) => {
        console.log("Is Buffering ==> ", isBuffering);
    }

    const onError = (error) => {
        console.log("Error ==> ", error);
    }

    return (
        <Video
            // Can be a URL or a local file.
            source={aiVideo}
            // Store reference  
            ref={videoRef}
            // Callback when remote video is buffering                                      
            onBuffer={onBuffer}
            // Callback when video cannot be loaded              
            onError={onError}
            muted={true}
            style={videoPlayerStyle}
            repeat={true}
        />
    )
}
