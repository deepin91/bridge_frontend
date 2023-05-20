import style from '../Profile/ProfileWrite.module.css'
import { useEffect, useState, useRef } from 'react';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

const ProfileWrite = () => {


    const editorRef = useRef(null);
    const history = useHistory();
    
    const [userId, setUserId] = useState('');
    const [position, setPosition] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [userSite, setUserSite] = useState('');
    const [profileImg, setProfileImg] = useState([]);
    const [select, setSelect] = useState('');
    const [music, setMusic] = useState([]);
    const [tag, setTag] = useState([]);

    useEffect(() => {
        if (sessionStorage.getItem('token') == null) {
            alert(`로그인이 필요합니다. 로그인해주세요`);
            history.push('/login')
            return;
          }
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        setUserId(decode_token.sub);
    }, [select])


    // 파일 선택창의 값을 직접 제어하기 위해서 사용  
    // const inputFiles = useRef();
    // 파일 크기 및 개수 제한
    const MAX_FILE_COUNT = 1;

    // 파일 종류, 크기, 개수 제한을 벗어나는 경우 메시지를 보여주고, 
    // 파일 입력창을 초기화하는 함수
    const isNotValid = msg => {
        alert(msg);
        profileImg.current.value = '';
        setProfileImg([]);
    };

    const handleProfile = (e) => {
        const files = e.target.files;
        if (files.length > MAX_FILE_COUNT) {
            isNotValid("이미지는 최대 1개 까지 업로드가 가능합니다.");
            return;
        }
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.match("image/.*")) {
                isNotValid("이미지 파일만 업로드 가능합니다.");
                return;
            }
        }
        setProfileImg([...files]);
    }


    const handleIntroduction = (e) => { setIntroduction(e.target.value); } //소개
    const handleSite = (e) => { setUserSite(e.target.value); } //사이트
    const handleSelect = (e) => { setSelect(e.target.value); };

    const handlerInstrument = (e) => {
        setTag([...tag, e.target.value])
    }

    // 서버로 전달할 폼 데이터를 작성

    const handleSubmit = () => {
        let datas = {
            userId,
            userSite,
            "userIntroduction": introduction,
            "userPosition": select,
            "userPortfolio" : editorRef.current.getInstance().getHTML()
        };
        const formData = new FormData();
        console.log(tag);
        formData.append(
            'data',
            new Blob([JSON.stringify(datas)], { type: 'application/json' })
        );
        formData.append(
            'tag',
            new Blob([JSON.stringify({ tags: tag })], { type: 'application/json' })
        );
        Object.values(profileImg).forEach(file => formData.append('files', file));
        Object.values(music).forEach(file => formData.append('music', file));

        axios({
            method: 'POST',
            url: `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/insertProfile/${userId}`,
            headers: { 'Content-Type': 'multipart/form-data;' },
            data: formData
        })
            .then(response => {
                console.log(response);
                alert(`정상적으로 업로드했습니다.`);
                history.push(`/profile/detail`)
            })
            .catch(error => {
                console.log(error);
                alert(`업로드 중 오류가 발생했습니다.`);
            });
    };

    return (
        <>
            <div className='container clearfix' >
                {/* <div className={style.loginbackg}> */}
                    <h1 className={style.login}>프로필 편집</h1>
                    <div className={style.button}>
                        <div style={{marginBottom:"10px"}}> 프로필 사진을 첨부해주세요</div>
                        <input type='file' className={style.signupinput} onChange={handleProfile} ref={profileImg} multiple accept="image/*" placeholder="프로필 사진을 첨부해주세요." />
                    </div>

                    <div className={style.button}>
                        <div style={{marginBottom:"10px",marginTop:"10px"}}> 프로필 음악을 첨부해주세요</div>
                        <input type='file' className={style.signupinput} onChange={(e) => { setMusic(e.target.files) }} multiple placeholder="프로필 음악을 첨부해주세요." />
                        {console.log("music--->" + music)}
                        {/* (e) => { setMusic(e.target.files) } */}
                    </div>
                    <div className={style.button}>

                    <select className={style.signupinput} onChange={handleSelect}>
                        <option value="" disabled selected>포지션 선택</option>
                        <option value="작곡가">작곡가</option>
                        <option value="연주자">연주자</option>
                        <option value="작곡가 겸 연주자">작곡가 겸 연주자</option>
                    </select>
                    </div>
                    <div className={style.button}>

                    <input className={style.signupinput} value={userSite} onChange={handleSite} placeholder="본인을 소개할 수 있는 링크를 입력해주세요." />
                    </div>
                    <div className={style.button}>

                    <input className={style.signupinput} value={introduction} onChange={handleIntroduction} placeholder="한줄소개를 입력해주세요." />
                    </div>

                    <div className={style.button}>

                    <select className={style.signupinput} onChange={handlerInstrument}>
                        <option value="" disabled selected>악기 선택</option>
                        <option value="성악">성악</option>
                        <option value="보컬">보컬</option>
                        <option value="바이올린">바이올린</option>
                        <option value="베이스">베이스</option>
                        <option value="일렉 기타">일렉 기타</option>
                        <option value="건반">건반</option>
                    </select>
                    </div>
                    <div className={style.button} style={{marginTop:"10px",paddingBottom:"10px"}}>
                        {
                            tag.map((d) => {
                                return (<span> {d} </span>)
                            })
                        }
                    </div>
                   
                    {/* <button onClick={handlerPortfolio}>포토폴리오 작성하기</button> */}
                {/* </div> */}
                <h2 className={style.portfolio}> 포토폴리오 작성</h2>
                <Editor
                    ref={editorRef}
                    // 미리보기 스타일 지정
                    previewStyle="vertical"
                    // 에디터 창 높이
                    height="500px"
                    //초기 입력모드 설정
                    initialEditType="wysiwyg"
                    //입력모드 변경 안보이게
                    hideModeSwitch={true}
                    //단축키 사용 여부
                    useCommandShortcut={true}
                    //글자색 변경 플러그인
                    plugins={[colorSyntax]}
                />
                <button className={style.loginbutton} onClick={handleSubmit}>저장하기</button>

            </div>
        </>

    )
}

export default ProfileWrite;