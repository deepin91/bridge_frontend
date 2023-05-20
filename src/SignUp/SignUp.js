import style from './SignUp.module.css';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useState } from "react";
import KakaoLogin from '../Login/KaKaoLogin';
import NaverLogin from '../Login/NaverLogin';

const SignUp = ({ history }) => {
    //이름
    const [userName, setName] = useState();
    //아이디
    const [userId, setUserId] = useState();
    //닉네임
    const [userNickname, setNickName] = useState();
    //비밀번호
    const [userPassword, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    //연락처
    const [userPhoneNumber, setPhone] = useState();
    //이메일
    const [userEmail, setEmail] = useState();

    const [confrimMessage, setConfrimMessage] = useState();
    const [Pmessage, setPmassage] = useState();
    const [Emassage, setEmassage] = useState();
    

    const handlerOnClick = e => {
        if (confrimMessage == null && Pmessage == null && Emassage == null && userId != null) {
            axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/regist`, { "userId" : userId, "userPassword": userPassword, "userPhoneNumber": userPhoneNumber, 
            "userEmail": userEmail, "userName" : userName, "userNickname" : userNickname })
                .then(response => {

                    alert('정상적으로 등록 되었습니다.')
                    history.push('/bridge/login')

                })
                .catch(error => {
                    alert('id, pw가 일치하지 않습니다')
                    console.log(error)
                    sessionStorage.clear();
                })
        } else {
            alert('형식이 일치하지 않습니다')
        }
    };

    const handlerChangeNickName = e => {
        setNickName(e.target.value);
    }
    //핸들러 모음
    const handlerChangeName = e => {
        setName(e.target.value);
    };
    const handlerChangeUserId = e => {
        
        setUserId(e.target.value);
    };
    const handlerChangePassword = e => {
        setPassword(e.target.value);
    };
    
    const handlerChangeConfrimPassword = e => {
        if (e.target.value === userPassword) {
            setConfirmPassword(e.target.value)
            setConfrimMessage(null);
        } else {
            setConfirmPassword(e.target.value);
            setConfrimMessage('비밀번호가 일치하지 않습니다.')
        }
    };
    const changePhone = e => {
        if (/^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/.test(e.target.value)) {
            setPhone(e.target.value);
            setPmassage(null);
        } else {
            setPhone(e.target.value);
            setPmassage('번호 형식이 올바르지 않습니다.');
        }
    };

    const handlerChangeEmail = e => {
        if (/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(e.target.value)) {
            setEmail(e.target.value);
            setEmassage(null);
        } else {
            setEmail(e.target.value);
            setEmassage('이메일 형식이 올바르지 않습니다.');
        }

    };

    //ID 중복체크
    const userIdCheck = () => {
        axios.post(`http://192.168.0.47:8080/api/idlist/${userId}`, )
            .then(response => {
                const data = response.data;
                if (data === 1) {
                    alert("이미 사용중인 아이디입니다.");

                } else if (data === 0) {
                    
                    alert("사용 가능한 아이디입니다.")
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    

    return (
        <>
            <div className='container clearfix' >
                <div className={style.loginbackg}>
                    <h1 className={style.login}>회원 가입</h1>

                    <input className={style.signupinput} onChange={handlerChangeName} placeholder="이름을 입력해주세요." />
                    {/* 저희 닉네임 사용하나요? */}
                    <input className={style.signupinput} onChange={handlerChangeNickName} placeholder="닉네임을 입력해주세요." />
                    <input className={style.signupinput} onChange={handlerChangeUserId} placeholder="아이디를 입력해주세요." />
                    <button className={style.idcheck} onClick={userIdCheck}>ID확인</button>
                    <input className={style.signupinput} onChange={handlerChangeEmail} placeholder="bridge@gmail.com" />
                    <div>{Emassage}</div>

                    <input className={style.signupinput2} onChange={handlerChangePassword} placeholder="비밀번호를 8자 이상 입력해주세요." />

                    <input className={style.signupinput2} onChange={handlerChangeConfrimPassword} placeholder="비밀번호를 재입력해주세요." />
                    <div >{confrimMessage}</div>
                    <input className={style.signupinput2} onChange={changePhone} placeholder="010-0000-0000" />
                    <div>{Pmessage}</div>
                    <br />
                    <button className={style.loginbutton} onClick={handlerOnClick}>회원 가입</button>
                    <p className={style.loginsns}>SNS로 가입하기</p>
                  <div className={style.kakao}>  <KakaoLogin/></div>
                    <div className={style.naver}><NaverLogin/></div>
                    
                </div>
            </div>
        </>

    )
}

export default SignUp;