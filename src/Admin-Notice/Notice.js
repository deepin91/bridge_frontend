import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
// import style from './Notice.module.css'
import style from './Notice.module.css'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
// import style from './Notice.module.css'
import searchImg from './searchImg.png'
// import { Link } from 'react-router-dom'
import jwt_decode from "jwt-decode";

function Notice({ history, noticeIdx, title, writer }) {

    const [datas, setDatas] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredDatas, setFilteredDatas] = useState([]);


    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const offset = (page - 1) * limit;
    const [value, setValue] = useState([]);
    const [check, setCheck] = useState(false);

    // const [checkBox, setCheckBox] = useState();
    const checkedData = [noticeIdx, title, writer]
    const [checkedArray, setCheckedArray] = useState([]);
    const [checkedList, setCheckedLists] = useState([]);
    const [isChecked, setIsChecked] = useState();
    const [checkingBox, setCheckingBoxs] = useState([]);

    const [id, setId] = useState('');


    useEffect(() => {
        if (sessionStorage.getItem('token') == null) {
            alert(`로그인이 필요합니다. 로그인해주세요`);
            history.push('/login')
            return;
        } else {
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        setId(decode_token.sub);
          
            axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/notice`)
                .then(response => {
                    console.log(response);
                    setDatas(response.data);
                })
                .catch(error => console.log(error));
        }
    }, []);



    /* 체크박스 전체 */
    const onAllCheckBox = (e) => {
        e.preventDefault();
        console.log(e.target.value);
        if (e.target.value == "false") {
            const indexArray = datas.map((notice, index) => notice.noticeIdx);
            setValue(indexArray);
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")
            setCheck(true);
        } else {
            console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb")
            setValue([]);
            setCheck(false);

        }
    }
    const handlerSerchInput = (e) => {
        setSearchInput(e.target.value);
    }

    const handlerSerchSubmit = (e) => {
        e.preventDefault();
        const filtered = datas.filter(notice => {
            console.log(`>${searchInput}<`)
            console.log(notice.title.includes(searchInput))
            return notice.title.includes(searchInput)
        }
        );
        console.log(filtered);
        setFilteredDatas(filtered);
        setPage(1);
    }


    const handlerClickDelete = () => {
        axios.delete(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/notice`, { noticeIdx })

            .then(response => {
                console.log(response);
                if (response.data.length === noticeIdx.length) {
                    alert('해당 글이 정상적으로 삭제되었습니다.');
                    history.push('/admin/notice/list');
                } else {
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



    const handlerOnclick = () => {
        history.push('/admin/notice/write');
    };




    return (
        <>



            <div className='container clearfix'>
                <div className={style.box1}>
                    <h1>공지사항</h1>
                </div>


                <div className={style.rightbox} onSubmit={handlerSerchSubmit}>


                    <div className={style.write}>
                        {id == 'admin' ? <button className={style.writebutton} onClick={handlerOnclick} >작성</button> : ""}
                    </div>
                    <div className={style.serchbox}>
                        <input type="text" className={style.search} value={searchInput} onChange={handlerSerchInput} placeholder="검색어를 입력하세요." />
                    </div>
                    <div className={style.serchbox}>
                        <img type="button" className={style.searchImg} src={searchImg} value="검색" onClick={handlerSerchSubmit} />
                    </div>

                </div>



                <div className={style.noticebox}>
                    {
                        filteredDatas != "" && filteredDatas.slice(offset, offset + limit).map((notice, index) => (
                            <div className={style.list}>
                                <Link to={`/notice/detail/${notice.noticeIdx}`}>
                                    <span className={style.title}>{notice.title}</span>
                                    <span className={style.writer}>{notice.userId}</span>
                                </Link>

                                <div>

                                </div>
                            </div>
                        ))
                    }


                    {
                        filteredDatas == "" && datas && datas.slice(offset, offset + limit).map((notice, index) => (
                            <div className={style.list}>


                                <Link to={`/notice/detail/${notice.noticeIdx}`}>
                                    <span className={style.title}>{notice.title}</span>
                                    <span className={style.writer}>{notice.userId}</span>
                                </Link>

                                <div>

                                </div>
                            </div>
                        ))
                    }
                </div>


                <div className={style.page}>

                    <nav className="pageNum" >
                        <button onClick={() => setPage(page - 1)} disabled={page === 1} >
                            &lt;
                        </button>
                        {
                            filteredDatas && Array(Math.ceil(filteredDatas.length / limit)).fill().map((page, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    aria-current={page === i + 1 ? "page" : null}
                                >
                                    {i + 1}
                                </button>
                            ))}

                        {
                            filteredDatas == "" && Array(Math.ceil(datas.length / limit)).fill().map((page, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    aria-current={page === i + 1 ? "page" : null}
                                >
                                    {i + 1}
                                </button>
                            ))}

                        {
                            filteredDatas == "" && datas ?
                                <button onClick={() => setPage(page + 1)} disabled={page == Math.ceil(datas.length / limit)}>
                                    &gt;
                                </button>
                                :
                                <button onClick={() => setPage(page + 1)} disabled={page == Math.ceil(filteredDatas.length / limit)}>
                                    &gt;
                                </button>
                        }

                    </nav>

                </div>
            </div>
        </>
    );

}


export default Notice;