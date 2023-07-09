/*
    Account : AnhNT282
    Description : Components message
    Date created : 2023/05/23
*/

import React, { useContext } from 'react';
import styled from 'styled-components';
import { formatRelative } from 'date-fns/esm';
import avatarAdmin from '../../assets/icon/admin.png'
import { MessageContext } from 'Context/MessageContext';

// format date relative AnhNT282
function formatDate(seconds) {
    let formattedDate = '';

    if (seconds) {
        formattedDate = formatRelative(new Date(seconds * 1000), new Date());
        // Capitalize first letter AnhNT282
        formattedDate =
            formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
}

function Message(props) {
    const { currentUser, adminId } = useContext(MessageContext)
    let isAdmin = props.userId == adminId ? true : false;
    return (
        <MessageStyle>
            <div className="message" style={{ alignItems: isAdmin ? "start" : "end" }}>
                <div className="info-message" style={{ flexDirection: isAdmin ? "row" : "row-reverse" }}>
                    <img src={isAdmin ? avatarAdmin : currentUser.image} style={{ height: 25, width: 25, backgroundColor: 'white', borderRadius: 50 }}></img>
                    <div className="name-user">{isAdmin ? "Admin" : "You"}</div>
                    <div className="time-sent" style={{ margin: 0 }}>{formatDate(props.time)}</div>
                </div>
                <div className="content-message" style={isAdmin ? { borderTopLeftRadius: 5 } : { borderTopRightRadius: 5, backgroundColor: 'rgb(0 102 255 / 90%)', color: 'white' }}>
                    {props.content}
                </div>
            </div>
        </MessageStyle>
    );
}

export default Message;
const MessageStyle = styled.div`

    .message {
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
    }
    .info-message {
        display: flex;
        padding: 15px 15px 5px 15px;
        justify-content: start;
        align-items: center;
    }
    .name-user, .time-sent {
        margin-left: 10px;
        margin-right: 10px;
        font-size: 14px;
        line-height: 18px;
        white-space: nowrap;
        overflow: hidden!important;
        text-overflow: ellipsis;
    }
    .info-message .name-user {
        font-weight: 600;
    }
    .info-message .time-sent {
        color: #9575CD;
    }
    .content-message {
        background: rgb(255, 255, 255);
        color: rgb(0, 0, 0);
        font-size: 16px;
        line-height: 20px;
        border-radius: 20px;
        word-wrap: break-word;
        white-space: pre-wrap;
        max-width: fit-content;
        padding: 15px 17px;
        margin: 0 15px;
    }
`;