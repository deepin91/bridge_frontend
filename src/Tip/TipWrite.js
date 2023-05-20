import { useState, useEffect } from 'react';
import ToastEditor from '../Component/ToastEditor'
import '../reset.css'
import style from '../Admin-Notice/NoticeWrite.module.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


export default function TipWrite() {

    const [title, setTitle] = useState("");
    const history = useHistory();

    useEffect(() => {
        if (sessionStorage.getItem('token') == null) {
            alert(`로그인이 필요합니다. 로그인해주세요`);
            history.push('/login')
            return;
          }
    }, [])

    return (
        <div className="container">
            <div className={style.topbox}><input className={style.titlebox} value={title} onChange={(e) => { setTitle(e.target.value) }} type='text' placeholder='제목'></input>
            </div>
            <div className={style.writebox}>
            <ToastEditor title={title}/>
            </div>
        </div>
    );
};