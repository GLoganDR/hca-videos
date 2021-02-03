import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router';
import Video from './../Video/Video'
import './VideoPlayer.css';
import RecommendedVideos from '../RecommendedVideos/RecommendedVideos';
import VideoInfo from '../VideoInfo/VideoInfo';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';

const VideoPlayer = () => {
    let { videoId } = useParams();

    const [videoInfo, setVideoInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    /*****USEEFFECT-HOOK*****
     * To trigger createVideoCards function when there is a state change in videoId state.
    */
    useEffect(() => {
        setVideoInfo([]);
        setIsLoading(true);
        axios
          .get(`https://www.googleapis.com/youtube/v3/videos?part=snippet%2C%20statistics&id=${videoId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`)
          .then(response => {
              if(response.data && response.data['items'] && response.data['items'][0]){
                createVideoInfo(response.data['items'][0]);
              }
              setIsError(false);
          })
          .catch(error => {
              console.log(error);
              setIsError(true);
          })
    }, [videoId])
    /*****Function*****
     * parameters: video - details of a video
     * Info: calls an api to get all properties of video and display
    */
    async function createVideoInfo (video) {
        const snippet = video.snippet;
        const stats = video.statistics;
        const channelId = snippet.channelId;
        const response = await axios
                              .get(`https://www.googleapis.com/youtube/v3/channels?part=snippet%2C%20statistics&id=${channelId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`)
        
        const channelImage = response.data.items[0].snippet.thumbnails.medium.url;
        const subs = response.data.items[0].statistics.subscriberCount;
        const publishedDate = new Date(snippet.publishedAt).toLocaleDateString('en-GB', {  
                                                                day : 'numeric',
                                                                month : 'short',
                                                                year : 'numeric'
                                                            });
        const title = snippet.title;
        const description = snippet.description;
        const channelTitle = snippet.channelTitle;

        setVideoInfo({
            title,
            description,
            publishedDate,
            channelTitle,
            channelImage,
        });
        setIsLoading(false);
    }
    if(isError) {
        return <Alert severity="error" className='loading'>No Results found!</Alert>
    }
    return (
        <div className='videoplayer'>
            <div className='videoplayer__videodetails'>
                <div className='videoplayer__video'>
                    {isLoading ? <CircularProgress className='loading' color='secondary'/> : <Video videoId={videoId} /> }
                </div>
                <div className='videoplayer__videoinfo'>
                    {!isLoading ? <VideoInfo
                                    title={videoInfo.snippet}
                                    description={videoInfo.description}
                                    publishedDate={videoInfo.publishedDate}
                                    channelTitle={videoInfo.channelTitle}
                                    channelImage={videoInfo.channelImage}
                                  /> : null
                    }
                </div>
            </div>
            <div className='videoplayer__suggested'>
                Recomended Videos: TODO
            </div>
        </div>
    )
}

export default VideoPlayer;
