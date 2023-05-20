import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from '../Admin-Report/ReportList.module.css'
import searchImg from './searchImg.png'
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


const ReportList = () => {

    const [data, setData] = useState([]);
    const [searchInput, setSearchInput] = useState([]);
    const [filteredDatas, setFilteredDatas] = useState([]);

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const offset = (page - 1) * limit;
    const [value, setValue] = useState([]);

    const history = useHistory();

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
        } else {
            axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/openReportList`)
                .then(response => {
                    console.log(response.data);
                    setData(response.data);
                })
                .catch(error => console.log(error));
        }
    }, []);


    const handlerSerchInput = (e) => {
        setSearchInput(e.target.value);
    }

    const handlerSerchSubmit = (e) => {
        e.preventDefault();
        setFilteredDatas(data.filter(datas => {
            console.log(`>>>>>>>>>>>>${searchInput}<`)
            return (
                datas.reportReason.includes(searchInput) ||
                datas.userId.includes(searchInput) ||
                datas.reportedUserId.includes(searchInput)
            )
        }
        ));
    }




    return (
        <>
            <div className='container clearfix'>
                <div className={style.box1}>
                    <h1>신고 관리</h1>
                </div>

                <form onSubmit={handlerSerchSubmit}>
                    <div className={style.serchbox}>
                        <img type="button" className={style.searchImg} src={searchImg} value="검색" onClick={handlerSerchSubmit} />
                    </div>
                    <div className={style.serchbox}>
                        <input type="text" className={style.search} value={searchInput} onChange={handlerSerchInput} placeholder="검색어를 입력하세요." />
                    </div>
                </form>
                <div className={style.reportbox}>

                    <ul className={style.info}>
                        <li>신고 번호</li>
                        <li>신고 사유</li>
                        <li>신고자</li>
                        <li>신고 대상</li>
                    </ul>

                    {
                        filteredDatas == "" && data.slice(offset, offset + limit).map((reportList) => {
                            return (
                                <>

                                    <div className={style.list}>
                                        <Link to={`/admin/report/detail/${reportList.reportIdx}`} >
                                            <span className={style.num}>
                                                {reportList.reportIdx}
                                            </span>
                                            <span className={style.reason}>
                                                {reportList.reportReason}
                                            </span>
                                            <span className={style.id}>
                                                {reportList.userId}
                                            </span>
                                            <span className={style.reid}>
                                                {reportList.reportedUserId}
                                            </span>
                                        </Link>
                                    </div>




                                </>
                            )
                        })
                    }
                    {
                        filteredDatas != "" && filteredDatas.slice(offset, offset + limit).map((reportList) => {
                            return (
                                <>
                                    <div className={style.list}>
                                        <Link to={`/admin/report/detail/${reportList.reportIdx}`} >
                                            <span className={style.num}>
                                                {reportList.reportIdx}
                                            </span>
                                            <span className={style.reason}>
                                                {reportList.reportReason}
                                            </span>
                                            <span className={style.id}>
                                                {reportList.userId}
                                            </span>
                                            <span className={style.reid}>
                                                {reportList.reportedUserId}
                                            </span>
                                        </Link>
                                    </div>
                                </>
                            )
                        })
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
                            filteredDatas == "" && Array(Math.ceil(data.length / limit)).fill().map((page, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    aria-current={page === i + 1 ? "page" : null}
                                >
                                    {i + 1}
                                </button>
                            ))}

                        {
                            filteredDatas == "" && data ?
                                <button onClick={() => setPage(page + 1)} disabled={page == Math.ceil(data.length / limit)}>
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
    )
}

export default ReportList;