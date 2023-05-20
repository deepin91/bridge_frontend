import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
// import style from "./wave.module.css";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min";




const Waveform = forwardRef((props, ref) => {
    const color = props.color
    useEffect(()=>{
        console.log(color)
    },[])
    const formWaveSurferOptions = (ref) => ({
        container: ref,
      
        
      
        splitChannels: false,
        splitChannelsOptions: {
          overlay: false,
          
          normalize: true,
      
          filterChannels: [
                            3
          ],
      
       
        
        channelColors: {
            0: color
        }},
      
        // waveColor: "#eee",
        // progressColor: "#67b3e2",
        cursorColor: "OrangeRed",
        barWidth: 5,
        barRadius: 2,
        responsive: true,
        height: 100,
        normalize: true,
        partialRender: true,
        interact: true,
        plugins: [
          CursorPlugin.create({
            showTime: true,
            opacity: 1,
            customShowTimeStyle: {
              'background-color': '#000',
              color: '#fff',
              padding: '2px',
              'font-size': '10px'
            }
        })
        ]
      });

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const url = props.src

  //추가
  let [currentTime, setCurrentTime] = useState('');
  let [min, setMin] = useState(0);
  let [sec, setSec] = useState(0);
  let [totalTime, setTotalTime] = useState('');
  let [tMin, setTMin] = useState(0);
  let [tSec, setTSec] = useState(0);

  //추추가
  // let [pauseTime, setPauseTime] = useState(0);
  // let [pMin, setPMin] = useState(0);
  // let [pSec, setPSec] = useState(0);

  //import 해서 사용 //.current.함수 로 사용하기 위해 선언
  useImperativeHandle(ref, () => ({
    // 부모 컴포넌트에서 사용할 함수를 선언
    PlayAll
  }))


  function PlayAll() {
    setPlay(!playing);
    wavesurfer.current.playPause();
  }

  useEffect(() => {
    // setPlay(false);


    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    console.log(url);
    wavesurfer.current.load(url);


    // wavesurfer.current.on("seek", function () {
    //   pauseTime = wavesurfer.current.getCurrentTime();
    //   setPauseTime(pauseTime);
    //   pMin = Math.floor(pauseTime / 60);
    //   setPMin(pMin);
    //   pSec = Math.round(pauseTime % 60);
    //   setPSec(pSec);
    // })

    wavesurfer.current.on("ready", function () {
      totalTime = wavesurfer.current.getDuration();
      setTotalTime(totalTime);
      tMin = Math.floor(totalTime / 60);
      setTMin(tMin);
      tSec = Math.round(totalTime - (tMin * 60));
      setTSec(tSec);

      // pauseTime = wavesurfer.current.getDuration();
      // setPauseTime(pauseTime);
    })

    wavesurfer.current.on("audioprocess", function () {
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
        currentTime = wavesurfer.current.getCurrentTime();
        setCurrentTime(currentTime);
        min = Math.floor(currentTime / 60);
        setMin(min);
        sec = Math.round(currentTime % 60);
        setSec(sec);
      }
    });
    return () => wavesurfer.current.destroy();
  }, [url]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  const onVolumeChange = e => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume || 1);
    }
  };

  // const [hover, setHover] = useState<string>('');

  // 멈춰 !!!!
  // let a = pMin + ":" + pSec
  // const [isHovering, setIsHovering] = useState(false);

  // const handleMouseOver = () => {
  //   setIsHovering(true);
  // };

  // const handleMouseOut = () => {
  //   setIsHovering(false);
  // };
  const test = () => {
    console.log(waveformRef.current)
  }
  return (
    <>
      <div>

        {/* <span className={style.pauseTime}> {a}</span> */}

        <div><button onClick={handlePlayPause}>{!playing ? "Play" : "Pause"}</button>{" "}
        <span>{min}:{sec}</span> - <span>{tMin}:{tSec}</span></div>

       


        <div id="waveform" ref={waveformRef} />
        {/* <p className ={style.explain} >{a}</p>  */}

        
        <div className="controls">
          {/* <button onClick={handlePlayPause}>{!playing ? "Play" : "Pause"}</button> */}
          {/* <button onClick={test}>asdasd</button> */}
          <label htmlFor="volume"><svg xmlns="http://www.w3.org/2000/svg"  width="20"
  height="20" viewBox="0 0 576 512"><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg></label>
          {" "}
          <input
            type="range"
            id="volume"
            name="volume"
            min="0.01"
            max="1"
            step=".025"
            onChange={onVolumeChange}
            defaultValue={volume}
            color="#3523d2"
          />
          {/* <label htmlFor="volume">Volume</label> */}
        </div>
      </div>

    </>
  );
}); 

export default Waveform;