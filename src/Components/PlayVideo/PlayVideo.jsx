import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'
import {useParams} from 'react-router-dom'
const PlayVideo = () => {
  const {videoId} = useParams();

  const[apiData,setApiData] = useState(null);

  const [channelData,setChannelData] = useState(null);
 
  const[commentData,setCommentData] = useState([])

  const fetchVideoData = async ()=>{
    //fetching video data
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
    await fetch(videoDetails_url).then(res=>res.json()).then(data=>setApiData(data.items[0]))
  }
  const fetchChannelData= async()=>{
    //fetching channel data
    const channelDetails_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`
    await fetch(channelDetails_url).then(res=>res.json()).then(data=>setChannelData(data.items[0]))
    //fetching comment
    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=100&videoId=${videoId}&key=${API_KEY}`
    await fetch(comment_url).then(res=>res.json()).then(data=>setCommentData(data.items))
  
  }

 

  useEffect(()=>{
 fetchVideoData();
  },[videoId])

  useEffect(()=>{
  fetchChannelData();
  },[apiData])
  return (
    <div className='play-video'>
      {/* <video src={video1} controls autoplay muted></video> */}
      <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      <h3>{apiData?apiData.snippet.title:"Title is Missing"}</h3>
      <div className="play-video-info">
        <p> {value_converter(apiData?apiData.statistics.viewCount:"views not available")} views &bull; {apiData?moment(apiData.snippet.publishedAt).fromNow():"details hidden"}</p>
       <div>
        <span><img src={like} alt="" />{value_converter(apiData?apiData.statistics.likeCount:"")}</span>
        <span><img src={dislike} alt="" /></span>
        <span><img src={share} alt="" /></span>
        <span><img src={save} alt="" />{apiData?apiData.statistics.favoriteCount:""}</span>
       </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData?channelData.snippet.thumbnails.default.url:""} alt="" />
        <div>
          <p> {apiData?apiData.snippet.channelTitle:""}</p>
          <span>{value_converter(channelData?channelData.statistics.subscriberCount:"")}</span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>{apiData?apiData.snippet.description.slice(0,250):"Description hidden"}</p>
       <hr />
       <h4>{value_converter(apiData?apiData.statistics.commentCount:"Comment counts hidden")} Comments</h4>
       
       {commentData.map((item,index)=>{
       return(
        <div key={index} className="comment">
        <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
        <div>
          <h3>{item.snippet.topLevelComment.snippet.authorDisplayName}<span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span></h3>
         <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
         <div className="comment-action">
          <img src={like} alt="" />
          <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
          <img src={dislike} alt="" />
         </div>
        </div>
       </div> 
       )
       })}
  
      </div>
    </div>
  )
}

export default PlayVideo
