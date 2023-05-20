import style from './Payment.module.css';
import user from './user.png';
import arrow from './PaymentImg.png';
import { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom';

function PaymentTest2({ match }) {
    const history = useHistory();

    //나중에 네이밍 변경해도 될까요? - 당연하쥐....

    const  producer  = "test1"; //제작자 (돈 받을 사람 우선 하드코딩 해뒀던 거)

    const [user1, setUser1] = useState([]);         //로그인한 유저 
    const [clients, setClients] = useState('');     //의뢰인(주는사람)
    // const [producer, setProducer] = useState('');   //제작자(받는사람)

    const [downpayment, setDownpayment] = useState('');     //결제금액

    const [usepoint, setUsepoint] = useState('');
    const [prevPoint, setPrevPoint] = useState(null);   //보유 포인트
    let [pointBox, setPointBox] = useState('');   //사용할 포인트
    const [total, setTotal] = useState(''); // 결제금액 - 사용할 포인트
    const [isChecked, setIsChecked] = useState(false); // 포인트 모두 사용



    useEffect(() => {
        if(sessionStorage.getItem('token') == null){
            alert(`로그인이 필요합니다. 로그인해주세요`);
            history.push('/login')
            return;
        }
        const token = sessionStorage.getItem('token');
        const decode_token = jwt_decode(token);
        setUser1(decode_token.sub);
        console.log(">>>>>>>>>>>>");
        axios.get(`http://localhost:8080/api/payment/detail/${decode_token.sub}`)
            .then(response => {
                console.log("=========> " + response);
                setUsepoint(response.data);
                setClients(decode_token.sub);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    //조건으로 결제하는 아이 (결제버튼 핸들러)
    //이 조건으로 실행해보고 되는지 알려주세욥
    //백엔드 코드는 만들어둿어요 제 컴퓨터에서 뽀려가시면 돼요!
    //db create 코드는 디스코드에 올려뒀어요
    const handlerOnClickToPay = (e) => {
        // setProducer(e.target.target);
        if (total == 0 && usepoint >= total) {
            console.log(producer , total);
            //어드민으로 ${producer} 하드코딩 추후 수정 필요
            axios.post(`http://localhost:8080/api/doPayment/${producer}`,
                { "clients": user1, "producer": producer, "usepoint": pointBox, "totalCost": total , downpayment}) 
                .then(response => {
                    console.log(response.data);
                    alert('결제가 완료되었습니다.');
                    history.push(`/deal/list`); //거래내역 페이지로 설정해뒀는데 추후 수정 필요 
                    //(아마 두잉으로 연결)
                })
                .catch(err => {
                    console.log(err);
                })
            // setTemp(usepoint);
            // setUsepoint(temp);

        } else if (total > 0 && usepoint > total && pointBox < total) {
            setTemp(usepoint);
            // setUsepoint(usepoint);
            alert('입력하신 금액보다 총 결제금액이 많습니다 \n확인 후 다시 시도하세요.');
            // setTemp(usepoint);
            setPointBox(0);
            setUsepoint(temp);
            setTotal(downpayment);
        } else {
            alert('보유 포인트가 부족합니다. 포인트를 충전해주세요.');
            history.push(`/partner/charge/${total}`); //충전 페이지 링크

        }
    }

    // temp가 뭔지 모르겠어요..(소윤) : 
    // temp는 모두사용 옆에 체크박스 사용 되었을 때 보유포인트를 0으로 만들어야함
    // > 기존 보유 포인트 보관할 곳 필요 > 그래서 보관소 개념으로 만들었던 부분같은골..
     
    const [temp, setTemp] = useState('');
    const handlerusepoint = (e) => {
        setTemp(Number(usepoint) - Number(pointBox));
        setTotal(Number(total) - Number(pointBox))
    }

    const handleCheckBoxChange = (e) => {
        if (!isChecked && usepoint >= downpayment) {
            console.log("결제 금액이 작음")
            setPointBox(downpayment);
            console.log(usepoint - downpayment);
            setTemp(usepoint - downpayment);
            setIsChecked(true);
            setTotal(0);
        } else if (!isChecked && usepoint < downpayment) {
            console.log("결제금액이 큼")
            setPointBox(usepoint);
            setTemp(0);
            setTotal(downpayment - usepoint);
            setIsChecked(true);
        } else if (isChecked) {
            setTotal(downpayment);
            console.log("체크 안됨")
            setTemp('');
            setPointBox(0);
            setIsChecked(false)
        }

        // if (e.target.checked && total <= usepoint) {
        //     setPrevPoint(usepoint);
        //      // usePoint 값을 0으로 변경
        //     setPointBox(total);
        //     setUsepoint(usepoint - total);
        //     // setTotal
        // // } else if(pointBox != null && isChecked(e.target.checked)  )  {
        // //     setUsepoint(prevPoint - total);
        // }else{
        //     setUsepoint(prevPoint); // 이전 usePoint 값으로 복구
        //     setPrevPoint(usepoint); // prevPoint 값 초기화
        //     setPointBox(usepoint);
        // }
    }


    return (
        <>
        {/* {
            usepoint.map((d) => {
                return(
                    <>
                <p>{d.userPonint}</p>
                </>
                )
            })
        } */}
            <div className='container clearfix' >
                <div className={style.mainBox}>
                    <div className={style.mainText}>결제</div>
                    <div className={style.profile}>
                        <div className={style.request}>
                            <div className={style.requestText}>{clients}</div>
                            <img src={user} className={style.requestImg}></img>
                        </div>

                        <img src={arrow} className={style.arrowImg}></img>

                        <div className={style.response}>
                            <div className={style.responseText}>{producer}</div>
                            <img src={user} className={style.responseImg}></img>
                        </div>
                    </div>

                    <div>
                        <span className={style.willPayment}>의뢰 완료시 결제될 금액</span>
                        <input type="number" value={downpayment} name="downpayment" className={style.willPaymentAm} placeholder='ex)  100,000'
                            onChange={e => {
                                setDownpayment(e.target.value)
                                setTotal(e.target.value)
                            }}></input>
                        {/* Number( */}
                    </div>
                    <div className={style.hr}>
                        <hr width="500px" color='black' size="1.5" />
                    </div>
                    <div className={style.total}> 총 결제 금액
                        <span className={style.totalPayment} name="total"> {total} 원</span>
                        {/* <span className={style.totalPayment} name="total"> {total} 원</span> */}
                        {/* {calculateSum().toLocaleString()} */}

                    </div>

                    <div>
                        <div className={style.point}>Bridge 포인트</div>
                        <div>
                            {/* <input type='text' value={pointBox} className={style.pointInput}></input> */}
                            {/* .toLocaleString() */}
                            {/* <input type="number" name="pointBox" value={pointBox} className={style.pointInput} onChange={(e)=>{
                                setPointBox(e.target.value)
                            }}onBlur={handlerusepoint} />  */}
                            <input type="number" name="pointBox" value={pointBox} className={style.pointInput} onChange={(e) => {
                                setPointBox(e.target.value)
                            }} onBlur={handlerusepoint} />
                            {/* <button className={style.paymentBtn} onClick={handlerOnClickUsePoint}>포인트 사용</button> */}
                            {/* {isChecked && <p checked={isChecked} className={style.pointP}>  {pointBox}P</p>} */}
                        </div>
                        <div className={style.havePoint}>
                            {
                                temp === '' ? <span className={style.have}>보유 {usepoint} P</span>
                                    :
                                    <span className={style.have}>보유 {temp} P</span>
                            }

                            <label for='All' className={style.selectText}>모두 사용</label>
                            {/* {
                                usepoint == 0 && pointBox != null ? <input type='checkbox' checked className={style.selectAll} id='All' name='All' value="All" onChange={handleCheckBoxChange} />
                                    :
                                    <input type='checkbox' checked={isChecked} className={style.selectAll} id='All' name='All' value="All" onChange={handleCheckBoxChange} />
                            } */}
                            <input type='checkbox' className={style.selectAll} id='All' name='All' value="All" onClick={handleCheckBoxChange} />
                        </div>

                        <button className={style.paymentBtn} onClick={handlerOnClickToPay}>결제</button>

                        {pointBox < total || usepoint < total == <p className={style.paymentNotice} >잔액이 부족합니다. 포인트를 충전해주세요.</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentTest2;