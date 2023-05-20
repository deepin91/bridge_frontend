
import { useEffect, useState } from 'react';
import style from './NoticeWrite.module.css';
import axios from 'axios';
// import Notice from './notice/NoticePage';
// import '../reset.css';
import NoticeToastEditor from '../Component/NoticeToastEditor.js'
import jwt_decode from "jwt-decode";




function NoticeWrite({history}) {

    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');

    useEffect(() => {
        if (sessionStorage.getItem('token') == null) {
            alert(`로그인이 필요합니다. 로그인해주세요`);
            history.push('/login')
            return;
          }
          const token = sessionStorage.getItem('token');
          const decode_token = jwt_decode(token);
          console.log(">>>>>>>>>>>>> " + decode_token);

          if (decode_token.sub != 'admin') {
            alert(`관리자만 이용할 수 있습니다`);
            history.push(`/`)
          }
    }, [])

    return (
        <>
           <div className="container">
            <div className={style.topbox}>
                <input className={style.titlebox} value={title} onChange={(e) => { setTitle(e.target.value) }} type='text' placeholder='제목'></input>
            </div>
            <div className={style.writebox}>
            <NoticeToastEditor title={title}/>
            </div>
        </div>
        </>
    );
}

export default NoticeWrite;