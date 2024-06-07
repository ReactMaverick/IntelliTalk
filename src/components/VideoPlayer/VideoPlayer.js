import Video from 'react-native-video';
import { styles } from './Style';
import { useEffect, useRef } from 'react';

export default function VideoPlayer({ videoPlayerStyle, playVideo, pauseVideo }) {
    const videoRef = useRef(null);
    const aiVideo = require('../../assets/video/ai_female.mp4');

    useEffect(() => {
        if (playVideo) {
            const randomTime = Math.floor(Math.random() * 10) + 1;
            videoRef.current.seek(randomTime);
            videoRef.current.play();
        } else if (pauseVideo) {
            videoRef.current.pause();
        }
    }, [playVideo, pauseVideo]);

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
        />
    )
}
