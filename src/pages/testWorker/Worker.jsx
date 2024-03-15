import React, { useRef, useState, useEffect } from "react";
import { Player, ControlBar, BigPlayButton, VolumeMenuButton, PlaybackRateMenuButton, ClosedCaptionButton } from 'video-react';

import nocan from '../../video/nocan.mp4'
import can from '../../video/can.mp4'
import hevc from '../../video/h264.hevc.mp4'
import "../../../node_modules/video-react/dist/video-react.css";
import './worker.scss'

const getData = () => {
    return new Promise()
}

class myPromise {
    constructor(callback) {
        this.callback = callback
        this.status = 'padding'
        this.data = null
        this.run()
    }

    then(thenFun) {
        setTimeout(() => {
            thenFun(this.data)
        }, 0)
    }

    catch(errFun) {
        setTimeout(() => {
            errFun(this.data)
        }, 0)
    }

    resolve(data) {
        debugger    
        if(this.status == 'padding') {
            this.status = 'resolved'
        }
        this.callback(data)
    }

    reject(data) {
        if(this.status == 'padding') {
            this.status ='rejected'
        }
    }

    run() {
        this.callback(this.resolve, this.reject)
    }
}




// 使用three.js创建简易第三人称场景

{/* <div id="J_prismPlayer"></div>
<script>
  var player = new Aliplayer({
    id: 'J_prismPlayer',
    source: '../src/video/can.mp4', // 播放地址，可以是第三方点播地址，或阿里云点播服务中的播放地址。
  },function(player){
    console.log('The player is created.')
 });
</script> */}

// 在react中将canvas渲染
const ThreePage = () => {
    // const boxRef = useRef()
    // var player = new Aliplayer({
    //     id: 'J_prismPlayer',
    //     source: nocan, // 播放地址，可以是第三方点播地址，或阿里云点播服务中的播放地址。
    //   },function(player){
    //     console.log('The player is created.')
    //  });
    return <>
        <div id="J_prismPlayer"></div>
    </>
}


const PlayH264And265 = () => {
    const playerRef = useRef()
    const [videoSrc, setVideoSrc] = useState('')

    const load = (e) => {
        console.log(e.target.value);
        const file = e.target.files[0]
        // 获取选中的文件        
        // 创建URL对象  
        const url = URL.createObjectURL(file);  
        
        // 将URL转换为字符串  
        const fileURL = url.toString();  
        
        // 打印URL  
        console.log(fileURL);  
        setVideoSrc(fileURL)
    }
    return <>
    <ThreePage></ThreePage>
         <input type="file" onChange={load} />
         {/* <a download target="downloadFile" href="https://tczt.jetone.cn:7101/ImgFile/Jetone/2023/SiteImg/20231226/tmp_d9e0d374fc8762d6b11179a201ed81bd.mp4">11111</a> */}

        <Player
            ref={playerRef}
            width={400}
            height={300}
            fluid={false}
            // autoPlay
            playsInline
            aspectRatio='4:3'
            // type='video/mp4;codecs="avc1.42E01E,mp4a.40.2"'
            src={can}
            // src='https://tczt.jetone.cn:7101/ImgFile/Jetone/2023/SiteImg/20231226/tmp_94cca07c0a22ceaed181e3591e6ad28b1e52f294aace8635.mp4'
        >
            <BigPlayButton position="center" />
            {/* <source src={nocan} type="video/mp4" /> */}
        </Player> 
        {/* <video controls width={400} height={300}>
            <source 
                src={nocan}
                // type='video/mp4;codecs="avc1.42E01E,mp4a.40.2"' 
            />
             Sorry, your browser doesn't support embedded videos.
        </video>
        <easy-player
            video-url={videoSrc}
            style={{width:600,height:500}}
        /> */}
        </>
}
export default PlayH264And265;