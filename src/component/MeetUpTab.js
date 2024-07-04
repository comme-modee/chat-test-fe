import React from 'react'
import { useNavigate } from 'react-router-dom';

import meetingImg from "../asset/img/meeting-img-02.jpg"

const MeetUpTab = ({ meetUp }) => {
  const navigate = useNavigate();
  const image = meetUp.image || meetingImg

  return (
    <div className="meetup-card" onClick={() => navigate(`/meetup/${meetUp._id}`)}>
      <img src={image} alt="meetUpImage" className="meetup-image" />
      <div className="meetup-details">
        <h3 className="meetup-title">{meetUp.title}</h3>
        <p className="meetup-location">{meetUp.location === "online" ? "온라인" : meetUp.location.replace(/;/g, ' ')}</p>
        <p className="meetup-date">{meetUp.date.date}</p>
        <p className="meetup-participants">
          Participants: {meetUp.currentParticipants} / {meetUp.maxParticipants}
        </p>
      </div>
    </div>
  )
}

export default MeetUpTab
