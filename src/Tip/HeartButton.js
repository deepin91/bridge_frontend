import React, { useState, useEffect } from "react";

import styled from "styled-components";
import HeartImg from './HeartImg.png';
import EmptyHeartImg from './EmptyHeartImg.png';

const Heart = styled.img`
    {
        
        width: 40px;
        height: 40px;
        
    
    }
`;

const HeartButton = ({ like, onClick }) => {
    return (
        <Heart src={like? HeartImg:EmptyHeartImg} onClick={onClick} />
    );
};

export default HeartButton;