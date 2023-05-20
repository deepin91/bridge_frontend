import axios from 'axios';
import { useEffect, useState } from 'react';
import style from './NoticeWrite.module.css';
// import style from './Notice.module.css';
import '../reset.css';
import { Viewer } from '@toast-ui/react-editor';
import { useHistory } from 'react-router-dom';
import jwt_decode from "jwt-decode";


function NoticeDetail({match}) {

    const { noticeIdx } = match.params;
    const [datas, setDatas] = useState([]);

    const [userId, setUserId] = useState('');

    const [data, setData] = useState([]);
    const [notice, setNotice] = useState({});
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const history = useHistory();
    const handlerChangeTitle = e => setTitle(e.target.value);
    const handlerChangeContents = e => setContents(e.target.value);



    useEffect(() => {
        if (sessionStorage.getItem('token') == null) {
            alert(`로그인이 필요합니다. 로그인해주세요`);
            history.push('/login')
            return;
        }
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        setUserId(decode_token.sub);
        // sessionStorage.setItem("token",'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6ImFkbWluIiwianRpIjoiN2I4MTY2Y2UtY2IzZC00NWU1LWExZDEtNjRhOGMzZGU0NWJhIiwiaWF0IjoxNjgzNTMwMTA4LCJleHAiOjg2NDAxNjgzNTMwMTA4fQ.0Ky3pPm61VOXna1rLOlI2KEUxTtxiPKxPwRDE5xSDko');
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/notice/detail/${noticeIdx}`)
            .then(reponse => {
                console.log(reponse);
                setNotice(reponse.data);
                setTitle(reponse.data.title);
                setContents(reponse.data.contents);
            })
            .catch(error => console.log(error));
    }, []);

    const handlerClickList = () => {
        console.log(history);
        history.push('/admin/notice/list');
    };

    const handlerClickUpdate = () => {
        axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/notice/update/${noticeIdx}`,
            { "title": title, "contents": contents }, { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response);
                if (response.data === 1) {
                    alert('정상적으로 수정되었습니다');
                    history.push(`/notice/detail/${noticeIdx}`)
                } else {
                    alert('수정 실패');
                    return;
                }
            })
            .catch(error => {
                console.log(error);
                console.log(error);
                alert(`수정에 실패했습니다.(${error.message})`)
                return;
            });
    };

    const handlerClickDelete = () => {
        axios.delete(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/notice/delete/${noticeIdx}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response);

                if (response.data) {
                    alert('해당 글이 정상적으로 삭제되었습니다.');
                    history.push('/admin/notice/list');
                } else if (!response.data) {
                    alert('삭제에 실패했습니다. 다시 시도해주세요.');
                    return;
                }
            })
            .catch(error => {
                console.log(error);
                alert(`삭제에 실패하였습니다.(${error.message})`);
                return;
            });
    };


    return (
        <>
          <div className='container clearfix'>
            <div className={style.box1}>
                <h1 className={style.Notice}>공지사항</h1>
            </div>
            <div className={style.Box}>

                {/* <input type="text" id="title" name="title" value={notice.title} onChange={handlerChangeTitle}/> */}
                <div className={style.TitleBox} > {notice.title}</div>
                {/* <input  value=} onChange={handlerChangeTitle}/> */}
                {/* <div className={style.TitleBox}>{notice.title}</div> */}



                <div className={style.ContentsBox}>  {notice.contents && <Viewer initialValue={notice.contents}></Viewer>} </div>
                {/* value= onChange={handlerChangeContents}/> */}
                {/* <textarea className={style.TitleBox} value={notice.contents} onChange={handlerChangeContents}></textarea> */}
                {userId == 'admin' ? <button className={style.Button2} onClick={handlerClickUpdate}>수정</button> : ""}
                {userId == 'admin' ? <button className={style.Button3} onClick={handlerClickDelete}>삭제</button> : ""}
                <button className={style.Button4} onClick={handlerClickList}>목록으로</button>
            </div>

            {/* { datas && datas.map(notice => (
                <div className={style.TitleBox}>
                    <div key={notice.title}>
                        <div>{notice.title}</div>
                        </div>
                        <div key={notice.ContentsBox}>
                        <div>{notice.contents}</div>
                        </div>
                        
                        </div>
                        ))
        } */}



            {/* <div className="title">
                            <Link to={`/notice/detail/${notice.noticeIdx}`}>{notice.title}</Link></td> */}
            {/* <Link to={`/notice/detail/${notice.noticeIdx}`}>{notice.title}</Link></div> */}
            </div>
        </>
    );
};

// function NoticeDetail({ match }) {

//   // const [aIdx, setAIdx] = useState('');
//   const { aIdx } = match.params;
//   // const [detail, setDetail] = useState('');
//   const [title, setTitle] = useState('');
//   const [contents, setContents] = useState('');

//   useEffect(() => {
//     // setAIdx(1);
//     axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/announcementDetail/${aIdx}`)
//       .then(response => {
//         console.log("+++++" + response.data);
//         setTitle(response.data.atitle);
//         setContents(response.data.acontents);
//       })
//       .catch(error => {
//         console.log(error);
//       })
//   }, []);

//   const handleChangeTitle = (e)=>{
//     setTitle(e.target.value);
// };

// const handleChangeContents = (e) => {
//   setContents(e.target.value);
// };

//   return (
//     <>
//       <h1 className={style.Notice}>공지사항 등록</h1>
//       <div className={style.Box}>
//         <h1 className={style.Title} >제목</h1>
//         <input className={style.TitleBox} value={title} onChange={handleChangeTitle}/>
//         <h1 className={style.Contents}>내용</h1>
//         <input className={style.ContentsBox} value={contents} onChange={handleChangeContents}/>
//         {/*  */}
//         <button className={style.Button2} onClick=''>수정</button>
//         <button className={style.Button3} onClick=''>삭제</button>
//       </div>
//     </>
//   );
// }

export default NoticeDetail;