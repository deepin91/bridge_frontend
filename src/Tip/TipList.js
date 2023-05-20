import style from './TipList.module.css'
import searchImg from '../Admin-Notice/searchImg.png'
import '../reset.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import guitars from '../img/guitars.jpg'

const TipList = () => {
    const history = useHistory();
    const [data, setData] = useState([]);
    const [filteredDatas, setFilteredDatas] = useState([]);


    useEffect(() => {
        if (sessionStorage.getItem('token') == null) {
            alert(`로그인이 필요합니다. 로그인해주세요`);
            history.push('/login');
            return;
        }
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/tiplist`)
            .then(r => {
                console.log(">>>>>>>>>>" + r.data);
                setData(r.data);
            })
    }, [])

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const offset = (page - 1) * limit;
    const [value, setValue] = useState([]);

    const [searchInput, setSearchInput] = useState('');

    // 검색 입력창
    const handlerSerchInput = (e) => {
        setSearchInput(e.target.value);
    }

    const handlerSerchSubmit = (e) => {
        e.preventDefault();
        const filtered = data.filter(data => {
            console.log(`>${searchInput}<`)
            console.log(data.tbTitle.includes(searchInput))
            return data.tbTitle.includes(searchInput)
        }
        );
        console.log(filtered);
        setFilteredDatas(filtered);
        setPage(1);
    }

    // 내림차순 정렬
    const [like, setLike] = useState([]);
    const arr = useState([data]);
    console.log(arr); // [5, 100, 20]

    arr.sort((a, b) => b - a);
    console.log(arr); // [100, 20, 5]

    const handleHeartClick = (e) => {
        return setLike(arr);
      };
   


    return (
        <>
            <div className={style.box1} >
                <h1>게시판</h1>
            </div>
            <div className='container clearfix'>
                <div className={style.topBox}>
                <div className={style.leftbox}>
                    <button className={style.good} onClick={handleHeartClick}>좋아요순</button>
                </div>

                <div className={style.rightbox}>

                    <input type="text" className={style.search} value={searchInput} onChange={handlerSerchInput} placeholder="검색어를 입력하세요." />
                    <img type="button" className={style.searchImg} src={searchImg} value="검색" onClick={handlerSerchSubmit} />
                </div>

                <div className={style.write}>
                        {/* <button class="custom-btn btn-11" onClick={() => {
                            history.push('/tip/write')
                        }}>작성</button> */}
    {/* <div className='container clearfix'> */}
<button className={style.btn6} onClick={() => {
                            history.push('/tip/write')
                        }}><span>작성</span>
                        </button>
                        {/* </div> */}
{/* <button class="custom-btn btn-11">Read More</button> */}
                    </div>
                    </div>
                <div className={style.tipbox}>
                    {
                        filteredDatas != "" && filteredDatas.slice(offset, offset + limit).map((data) => {
                            console.log(data.tbIdx)
                            { console.log("++++++++++" + filteredDatas) }
                            return (

                                <Link to={`/tip/detail/${data.tbIdx}`} className={style.list}>
                                    <a className={style.title}>{data.tbTitle}</a>
                                    <a className={style.writer}>{data.userId}</a>
                                    <a className={style.heart}>♡</a>
                                    <a className={style.count}>{data.tbHeart}</a>

                                </Link>
                            )

                        })
                    }


                    {
                        filteredDatas == "" && data && data.slice(offset, offset + limit).map((data) => {

                            return (

                                <Link to={`/tip/detail/${data.tbIdx}`} className={style.list}>
                                    <a className={style.title}>{data.tbTitle}</a>
                                    <a className={style.writer}>{data.userId}</a>
                                    <a className={style.heart}>♡</a>
                                    <a className={style.count}>{data.tbHeart}</a>

                                </Link>
                            )
                        })
                    }
                </div>
                <div className={style.page}>

                    <nav className={style.pageNum} >
                        <button className={style.pageButton} onClick={() => setPage(page - 1)} disabled={page === 1} >
                            &lt;
                        </button>
                        {
                            filteredDatas && Array(Math.ceil(filteredDatas.length / limit)).fill().map((page, i) => (
                                <button className={style.pageButton}
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    aria-current={page === i + 1 ? "page" : null}
                                >
                                    {i + 1}
                                </button>
                            ))}

                        {
                            filteredDatas == "" && Array(Math.ceil(data.length / limit)).fill().map((page, i) => (
                                <button className={style.pageButton}
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    aria-current={page === i + 1 ? "page" : null}
                                >
                                    {i + 1}
                                </button>
                            ))}

                        {
                            filteredDatas == "" && data ?
                                <button className={style.pageButton}
                                onClick={() => setPage(page + 1)} disabled={page == Math.ceil(data.length / limit)}>
                                    &gt;
                                </button>
                                :
                                <button className={style.pageButton}
                                onClick={() => setPage(page + 1)} disabled={page == Math.ceil(filteredDatas.length / limit)}>
                                    &gt;
                                </button>
                        }
                    </nav>
                </div>
            </div>

        </>
    )
}

export default TipList;