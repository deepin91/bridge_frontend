import style from "./PartnerWrite.module.css";
import "../reset.css";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const PartnerWrite = () => {

    const [title, setTitle] = useState('');
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [money, setMoney] = useState(0);
    const [partnerImg, setPartnerImg] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');
    const [inputImg, setInputImg] = useState([]);



    const history = useHistory();

    useEffect(() => {
        if (sessionStorage.getItem('token') == null) {
            alert(`로그인이 필요합니다. 로그인해주세요`);
            history.push('/login')
            return;
        }
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        setUserId(decode_token.sub);
    }, [])

    // 파일 크기 및 개수 제한
    const MAX_FILE_SIZE = 1 * 1024 * 1024; //1MB
    const MAX_FILE_COUNT = 1;

    // 파일 종류, 크기, 개수 제한을 벗어나는 경우 메시지를 보여주고, 
    // 파일 입력창을 초기화하는 함수
    const isNotValid = msg => {
        alert(msg);
        inputImg.current.value = '';
        setInputImg([]);
    };

    const handleInputImg = (e) => {
        const files = e.target.files;
        if (files.length > MAX_FILE_COUNT) {
            isNotValid("이미지는 최대 1개 까지 업로드가 가능합니다.");
            return;
        }
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.match("image/.*")) {
                isNotValid("이미지 파일만 업로드 가능합니다.");
                return;
            } else if (files[i].size > MAX_FILE_SIZE) {
                isNotValid("이미지 크기는 1MB를 초과할 수 없습니다.");
                return;
            }
        }
        setInputImg([...files]);
    }

    //태그
    const partnerTag = [
        { name: '여성보컬' },
        { name: '남성보컬' },
        { name: '일렉기타' },
        { name: '어쿠스틱기타' },
        { name: '베이스기타' },
        { name: '드럼' },
        { name: '퍼커션' },
        { name: '브라스' },
        { name: '바이올린' },
        { name: '첼로' },
        { name: '콘트라베이스' },
        { name: '피아노' },
        { name: '신디사이저' }
    ];

    const handleTitle = (e) => { setTitle(e.target.value); } //제목
    const handleDate1 = (e) => { setDate1(e.target.value); } //시작일
    const handleDate2 = (e) => { setDate2(e.target.value); } //종료일
    const handleMoney = (e) => { setMoney(e.target.value); } //금액
    const handleContent = (e) => { setContent(e.target.value); } //내용

    //선택된 태그 담을 상태변수
    const [checkedList, setCheckedList] = useState([]);

    const handleCheck = (checked, id) => {
        if (checked) {
            setCheckedList([...checkedList, id]);
        } else {
            setCheckedList(checkedList.filter((el) => el !== id)); //체크해제
        }
    }

    let datas = {
        "crTitle": title,
        "crContents": content,
        userId,
        "crMoney": money,
        "crStartDate": date1,
        "crEndDate": date2,
        "crtTag": checkedList
    };

    const formData = new FormData();
    formData.append(
        'data',
        new Blob([JSON.stringify(datas)], { type: 'application/json' })
    );
    Object.values(inputImg).forEach(file => formData.append('files', file));

    const handleSumit = () => {
        const result = window.confirm("사이트 정책상 수정이 불가합니다. \n등록 전 내용을 다시 한 번 확인해주세요.")
        if (result) {

            axios({
                method: 'POST',
                url: `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/insertPartnerWrite`,
                headers: { 'Content-Type': 'multipart/form-data;' },
                data: formData
            })
                .then(response => {
                    console.log(response);
                    alert(`정상적으로 업로드했습니다.`);
                    history.push('/partner/list')
                })
                .catch(error => {
                    console.log(error);
                    alert(`모든 항목을 작성해주세요.`);
                });

        }
    };

    return (
        <>
            <div className="container clearfix" >

                <h1 className={style.mainText}>나의 연주자 찾기</h1>

                <div className={style.content}>
                    <div className={style.title}>
                    <span className={style.titleText}>제목: </span>
                        <input type="text" value={title} onChange={handleTitle} className={style.titleInput} placeholder="제목을 입력해주세요."></input>
                    </div>
                    <div className={style.period}>
                        <span className={style.periodText}>기간: </span>
                        <input type='date' value={date1} onChange={handleDate1} className={style.periodInput1} />
                        -
                        <input type='date' value={date2} onChange={handleDate2} className={style.periodInput2} />
                    </div>
                    <div className={style.money}>
                        <span className={style.moneyText}>금액: </span>
                        <input type="number" value={money} onChange={handleMoney} className={style.moneyInput}></input>
                    </div>
                    <div className={style.tag}>
                        <span className={style.tagText}>태그: </span>
                        <div className={style.alltags}>
                            {partnerTag.map((tag, idx) => {
                                return (
                                    <>
                                        <div className={style.tagbox} key={idx}>
                                            <input className={style.tagInput} type="checkbox" id={tag.name} onChange={(e) =>
                                                handleCheck(e.currentTarget.checked, tag.name)
                                            } />
                                            <label htmlFor={tag.name}>{tag.name}</label>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                    <div className={style.image}>
                        <span className={style.imageText}>이미지: </span>
                        <input type="file" onChange={handleInputImg} ref={inputImg} multiple accept="image/*" className={style.imageInput}></input>
                        {/* <button className={style.imageButton}>첨부</button> */}
                    </div>
                    <div className={style.intro}>
                        <span className={style.introText}>소개글: </span>
                        <textarea value={content} onChange={handleContent} className={style.introInput} placeholder="※ 사이트 정책상 수정이 불가하오니, 신중히 작성해주시길 부탁드립니다."></textarea>
                    </div>
                    <div className={style.regist}>
                        <button onClick={handleSumit} className={style.registButton}>등록</button>
                    </div>
                </div>


            </div>
        </>
    )
};

export default PartnerWrite;