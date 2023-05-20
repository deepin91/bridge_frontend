import style from './ProfileDetail.module.css'
import '../reset.css';
import certiMark from "./icons/certiMark.svg"
import profile_img from "./icons/user.svg"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Viewer } from '@toast-ui/react-editor';
import Waveform from './Waveform';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { CreateOutlined, MailOutline, ReportProblemOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";


function ProfileDetail() {
    const [data, setData] = useState([]);
    const [user, setUser] = useState('');
    const [tag, setTag] = useState('');
    const [userId, setUserId] = useState('');

    const history = useHistory();

    // const reported = match.params;

    useEffect(() => {
        if (sessionStorage.getItem('token') == null) {
            alert(`로그인이 필요합니다. 로그인해주세요`);
            history.push('/login')
            return;
        } else {
            const token = sessionStorage.getItem('token');
            const decode_token = jwt_decode(token);
            setUserId(decode_token.sub);
            axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/profile/${decode_token.sub}`)
                .then((response) => {
                    console.log(response.data)
                    setData(response.data.profile[0]);
                    setUser(response.data.userDto);
                    setTag(response.data.taglist)
                })
        }
    }, [userId])
    let a = 0;
    return (
        <>
            <div className='box1'>
                <h1>Profile</h1>
            </div>
            <div className='container clearfix'>
                <div className={style.profile}>
                    <img className={style.profileIMG} src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getImage/${data.profileImg}.jpg`} />
                    <span className={style.name}>{user.userId}</span>
                    {
                        a == 0 &&
                        <img src={certiMark} className={style.certi}></img>
                    }
                    <p style={{ marginTop: "10px", marginBottom: "10px" }}>{data.userPosition}</p>
                    <p className={style.comment}>
                        {data.userIntroduction}
                        {/* 한줄 소개 입니다.Lorem ipsum dolor sit amet consectetur.
                        Aliquam mattis nam rutrum platea lectus lobortis consectetur. */}
                    </p>
                    <p>
                        {
                            Array.isArray(tag) && tag.map((d) => {
                                return (<span>#{d.tag}</span>)

                            })
                        }
                    </p>

                    <p className={style.link} onClick={() => { window.open('https://google.co.kr', '_blank') }}>{data.userSite}</p>


                    <Link to="#">   <MailOutline sx={{ fontSize: 24 }} /> </Link>
                    <Link to="/profile/write"><CreateOutlined sx={{ fontSize: 24 }} /></Link>
                    <Link to={`/report/write/${userId}`}><ReportProblemOutlined sx={{ fontSize: 24 }} /></Link>
                    {/* <img src={Message} className={style.icon}></img>
                    <img src={PersonPinCircle} className={style.icon}></img>
                    <img src={Report} className={style.icon}></img> */}



                </div>
                <div className={style.detail}>
                    <div className={style.playbar}>
                        <Waveform
                            data={data.userMusic}
                            src={`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/getMusic/${data.userMusic}`}
                        />
                    </div>
                    <div className={style.introduce}>
                        {data.userPortfolio && <Viewer initialValue={data.userPortfolio}></Viewer>}
                    </div>
                </div>
                <div className={style.review}>
                    <p style={{ fontSize: "20px", marginTop: "20px" }}>후기</p>
                    <div className={style.reviewdetail}>
                        <p className={style.reviewtitle}>작업물 제목</p>
                        <p className={style.reviewcontents}>
                            최고입니다.................. 나서서 작곡 커미션을 넣기는 처음이라 이래저래 걱정이 많았는데,
                            부족한 설명만으로도 정말 어렴풋이 상상하고 있었던 이미지를 정확히 잡아주셔서 만족스러운 결과물을 받을 수 있었어요...
                        </p>
                    </div>
                    <div className={style.reviewdetail}>
                        <p className={style.reviewtitle}>작업물 제목</p>
                        <p className={style.reviewcontents}>
                            최고입니다.................. 나서서 작곡 커미션을 넣기는 처음이라 이래저래 걱정이 많았는데,
                            부족한 설명만으로도 정말 어렴풋이 상상하고 있었던 이미지를 정확히 잡아주셔서 만족스러운 결과물을 받을 수 있었어요...
                            다음에 꼭 다시 찾아뵙겠습니다...😭😭😭
                        </p>
                    </div>
                    <div className={style.reviewdetail}>
                        <p className={style.reviewtitle}>작업물 제목</p>
                        <p className={style.reviewcontents}>
                            최고입니다.................. 나서서 작곡 커미션을 넣기는 처음이라 이래저래 걱정이 많았는데,
                            부족한 설명만으로도 정말 어렴풋이 상상하고 있었던 이미지를 정확히 잡아주셔서 만족스러운 결과물을 받을 수 있었어요...
                            다음에 꼭 다시 찾아뵙겠습니다...😭😭😭
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}
export default ProfileDetail;