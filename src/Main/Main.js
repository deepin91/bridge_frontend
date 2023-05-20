import style from './Main.module.css';
import '../reset.css'
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from "swiper";	// 추가
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";


SwiperCore.use([Autoplay])	// 추가
const Main = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/notice`)
            .then((r) => {
                setData(r.data)
                console.log(r.data)
            }
            )
    }, [])

    return (
        <div className={style.container}>
            <div className={style.textBox}>
                <h1 className={style.mainText}>Your favorite songs, 
                <br/>like never heard before</h1>
                </div>
                
                <div className={style.firstLine}>
                    <Link to={`/jam/list`}>
                        <button className={style.online}>
                            <p>Make Music</p>
                        </button>
                    </Link>
                    <Link to={`/partner/list`}>
                        <button className={style.offline}>
                            <p>Commission</p>
                        </button>
                    </Link>
                </div>
                <div className={style.secondLine}>
                    <Link to={`/split`}>
                        <button className={style.musicSep}>
                            <p>Split Music</p>
                        </button>
                    </Link>
                    <Link to={`/tip/list`}>
                        <button className={style.community}>
                            <p>Community</p>
                        </button>
                    </Link>
                    
                </div>
                <div style={{marginTop:50}}>
                <Swiper
                    className="banner"
                    spaceBetween={50}
                    slidesPerView={1}
                    autoplay={{ delay: 10000 }}
                    speed={1000}
                 
                >
                    {
                        data.map((n, index) => {

                            const data = new Date(n.createdDt);
   
                            const month = data.getMonth()+1
                  
                            return (
                                <SwiperSlide>
                                    <p className={style.title} style={{ padding: 21}}>공지사항</p>
                                    <p className={style.link} style={{ padding: 21 }}>
                                        {/* 공지사항 링크 */}
                                        <Link to={`/notice/detail/${n.noticeIdx}`} title="공지사항 상세보기">

                                            {n.title}</Link>
                                    </p>
                                    <div><p className={style.date} style={{ padding: 21, marginRight: '16px' }}>{data.getFullYear() +"년 "+ month + "월 " +data.getDate() +"일"}</p></div>
                                    <div> <p className={style.more} style={{ padding: 21 }}>
                                        <Link to="/admin/notice/list" style={{ color: '#EAEAEA' }} title="전체공지 더보기">더보기</Link>
                                    </p></div>
                                </SwiperSlide>
                            )
                        }
                        )
                    }

                </Swiper>
                </div>
            </div>
       
    );
}

export default Main;