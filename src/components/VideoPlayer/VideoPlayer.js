import Video from 'react-native-video';
import { styles } from './Style';
import { useEffect, useRef, useState } from 'react';
import Loader from '../Loader/Loader';

export default function VideoPlayer({ videoPlayerStyle, playVideo, pauseVideo, assistant }) {
    const videoRef = useRef(null);
    const aiVideo = assistant === 'John' ? require('@/assets/video/ai_john.mp4') : require('@/assets/video/ai_jenny.mp4');

    const [isVideoLoading, setIsVideoLoading] = useState(true);

    useEffect(() => {
        // console.log('videoRef.current ==> ', videoRef.current);
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

            videoRef.current.seek(0);
            videoRef.current.pause();
        }
    }, [playVideo, pauseVideo, videoRef]);

    const onBuffer = ({ isBuffering }) => {
        // console.log("Is Buffering ==> ", isBuffering);
    }

    const onError = (error) => {
        // console.log("Error ==> ", error);
    }

    return (
        <>
            {isVideoLoading && <Loader />}
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
                style={[videoPlayerStyle,
                    isVideoLoading ? { display: 'none' } : { display: 'flex' }
                ]}
                repeat={true}
                onLoadStart={() => setIsVideoLoading(true)}
                onLoad={() => setIsVideoLoading(false)}
            />
        </>
    )
}
