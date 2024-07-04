import React, { useEffect } from 'react';
import "../style/meetUpMemberProfile.style.css";
import { useNavigate } from 'react-router-dom';

const MeetUpMemberProfile = ({ participant }) => {
    const navigate = useNavigate();

    return (
        <div className='meetup-member' onClick={() => navigate(`/me/${participant?.nickName}`)} >
            <img src={participant?.profileImage} alt='' />
            <span>{participant?.nickName}</span>
        </div >
    )
}

export default MeetUpMemberProfile
