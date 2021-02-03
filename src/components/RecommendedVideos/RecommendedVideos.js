import React, {useEffect, useState} from 'react';
import './RecommendedVideos.css';
import VideoRow from './../VideoRow/VideoRow';
import {useParams} from 'react-router';
import axios from 'axios';
import {DateTime} from 'luxon';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';


const RecommendedVideos = (props) => {
    let { covidVideos, allVideos } = useParams();
    const [totalPlayListsCount, setTotalPlayListsCount] = useState(0);
    const [playListsCurrentCount, setPlayListsCurrentCount] = useState(0);
    const [videosList, setVideosList] = useState([]);
    const [videoCards, setVideoCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const getPlayListsURL = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=UCL03ygcTgIbe36o2Z7sReuQ&maxResults=50&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`;
    const getOnlyCovid19PlayListURL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&key=${process.env.REACT_APP_YOUTUBE_API_KEY}&maxResults=20&playlistId=PLogA9DP2_vSekxHP73PXaKD6nbOK56CJw`;
    const getOnlyCovidVideos = !!(covidVideos);

    /*****USEEFFECT-HOOK*****
     * To trigger getPlayListVideos function when there is a state change in covidVideos, allVideos state
    */
   useEffect(() => {
    getPlayListVideos();
  }, [covidVideos, allVideos]);
  
    /*****USEEFFECT-HOOK*****
     * To trigger getPlayListVideos function when this component is loaded
    */
    useEffect(() => {
      getPlayListVideos();
    }, []);

    /*****USEEFFECT-HOOK*****
     * To trigger createVideoCards function when there is a state change in videosList or playListsCurrentCount.
    */
    useEffect(() => {
      if(playListsCurrentCount > 0 && playListsCurrentCount === totalPlayListsCount) {
        createVideoCards(videosList);
      }
    }, [videosList,playListsCurrentCount])
    /*****Function*****
     * parameters: none
     * Info: calls an api to get playlist details in a youtube channel
    */
    function getPlayListVideos() {
      axios
      .get(getOnlyCovidVideos ? getOnlyCovid19PlayListURL : getPlayListsURL)
      .then(response => {
        getOnlyCovidVideos ? 
          createVideoCards(response.data.items) : 
          getVideosFromPlayList(response.data.items);
      })
      .catch(error => {
        console.log(error);
        setIsError(true);
      })
    }
    /*****Function*****
     * parameters: playLists - list of details from youtube playlists called from getPlayListVideos function
     * Info: calls an api to get list of all video details in an array from an youtube channel
    */
    async function getVideosFromPlayList(playLists) {
      setTotalPlayListsCount(playLists.length);
      for (const playList of playLists) {
        const playListId = playList.id;
        await axios
                .get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=25&playlistId=${playListId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`)
                .then(response => {
                  setPlayListsCurrentCount(count => count+1);
                  setVideosList([
                    ...videosList,
                    ...response.data.items
                  ]);
                })
                .catch(error => {
                  console.log(error);
                  setIsError(true);
                });
      }
    }
    /*****Function*****
     * parameters: videoItems - list of all video details in an array.
     * Info: calls an api to get details of each video available in videoItems parameter
    */
    async function createVideoCards(videoItems) {
      let newVideoCards = [];
      for (const video of videoItems) {
        const videoId = video.contentDetails.videoId;
        const snippet = video.snippet;
        const channelId = snippet.channelId;
        const response = await axios
                              .get(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=UCL03ygcTgIbe36o2Z7sReuQ&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`)
        const channelImage = response.data.items[0].snippet.thumbnails.medium.url;

        const title = snippet.title;
        const image = snippet.thumbnails.medium.url;
        const timestamp = DateTime.fromISO(snippet.publishedAt).toRelative();
        const channel = snippet.channelTitle;
        const description = snippet.description;

        newVideoCards.push({
          videoId,
          image,
          title,
          channel,
          timestamp,
          channelImage,
          description
        });
      };
      setVideoCards(newVideoCards);
      setIsLoading(false);
    }

    if(isError) {
      return <Alert severity="error" className='loading'>No Results found!</Alert>
    }
    return (
        
        <div className='recommendedvideos'>
            { isLoading ? <CircularProgress className='loading' color='secondary' /> : null }
            <div className="recommendedvideos__videos">
                {
                  videoCards.map(item => {
                    return (
                            <Link key={item.videoId} to={`/video/${item.videoId}`}>
                              <VideoRow
                                title={item.title}
                                image={item.image}
                                timestamp={item.timestamp}
                                channel={item.channel}
                                description={item.description}
                              />
                            </Link>
                    )
                  })
                }
            </div>
            <div>
            </div>
        </div>
    )
}

export default RecommendedVideos;
