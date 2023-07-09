/*
    Account : AnhNT282
    Description : Components boxchat
    Date created : 2023/05/23
*/

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons'
import { Row, Col, Input } from 'antd';
import Message from './Message';
import { useState, useContext } from 'react';
import firebase, { firestore } from '../../firebase/config';
import { MessageContext } from '../../Context/MessageContext';
import avatarAdmin from '../../assets/icon/admin.png'


function BoxChat() {
    const { listMessage, currentUser, adminId } = useContext(MessageContext);
    const [showBoxChat, setShowBoxChat] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const messageListRef = useRef(null);
    console.log(listMessage);

    useEffect(() => {
        // Scroll to the last message when the element is displayed or there is a new message AnhNT282
        if (messageListRef.current) {
            messageListRef.current?.lastElementChild?.scrollIntoView();
        }
    }, [listMessage, showBoxChat]);


    const handleSendMessage = () => {
        if (!inputMessage) return;
        // Add message from user to admin AnhNT282
        const userAdminRef = firestore.collection('messages');

        const chatData = {
            senderId: currentUser.id,
            receiverId: adminId,
            content: inputMessage,
            createAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        // Make adding messages to Firestore AnhNT282
        userAdminRef.add(chatData)
            .then(() => {
                console.log('Success!');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        setInputMessage('');
    }

    return (
        <>
            {currentUser && (
                showBoxChat ? (
                    <ChatBoxStyles>
                        <div className='box-chat'>
                            <Row className="header-box-chat">

                                <Col style={{ margin: 'auto' }} span={5}>
                                    <img className='avatar' src={avatarAdmin} style={{ marginLeft: 10 }}></img>
                                </Col>
                                <Col span={16} style={{ alignSelf: "center" }}>
                                    <div className='info-admin'>
                                        <div className="name-admin">Admin</div>
                                        <div className='status'>Online</div>
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <CloseOutlined onClick={() => setShowBoxChat(false)} style={{ cursor: 'pointer', fontSize: 20, fontWeight: 600, marginTop: 15 }} />
                                </Col>
                            </Row>
                            <div className="content-box-chat">
                                <ListMessageStyle ref={messageListRef}>
                                    <Message userId={adminId} avatar={avatarAdmin} time={Date.now.seconds} content="Tôi có thể giúp gì cho bạn"></Message>
                                    {listMessage && listMessage.map((message, index) => (
                                        <Message key={index} userId={message.senderId} time={message.createAt?.seconds} content={message.content}></Message>
                                    ))}
                                </ListMessageStyle>
                                <SendMessageStyle>
                                    <div className='typing'>
                                        <div className="input-message">
                                            <Input
                                                value={inputMessage}
                                                onChange={(e) => setInputMessage(e.target.value)}
                                                onPressEnter={handleSendMessage}
                                                placeholder='Nhập tin nhắn...'
                                                bordered={false}
                                                autoComplete='off'
                                            />
                                        </div>
                                        <div className="button-send" onClick={handleSendMessage}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xmlSpace="preserve"><path fill={inputMessage ? "#0066FF" : "#d7d7d7"} d="M22,11.7V12h-0.1c-0.1,1-17.7,9.5-18.8,9.1c-1.1-0.4,2.4-6.7,3-7.5C6.8,12.9,17.1,12,17.1,12H17c0,0,0-0.2,0-0.2c0,0,0,0,0,0c0-0.4-10.2-1-10.8-1.7c-0.6-0.7-4-7.1-3-7.5C4.3,2.1,22,10.5,22,11.7z" /></svg>
                                        </div>
                                    </div>
                                </SendMessageStyle>
                            </div>
                        </div>
                    </ChatBoxStyles >

                ) :
                    <ButtonChatStyle>
                        <img onClick={() => setShowBoxChat(true)} style={{ height: 60, width: 60, borderRadius: 50 }} src="https://cdn.chatbot.com/widget/61f28451fdd7c5000728b4f9/DSjjJVtWgP_jxGWP.png" className="icon-chat" />
                    </ButtonChatStyle>
            )}
        </>

    );
}

export default BoxChat;

const ButtonChatStyle = styled.div`
    position: fixed;
    right: 20px;
    bottom: 20px;
    cursor: pointer;
    z-index: 999;
`;

const SendMessageStyle = styled.div`
    .typing {
        height: 50px;
        border-top: 1px solid;
        padding-right: 20px;
        background: rgb(255, 255, 255);
        border-top-color: rgb(234, 234, 234);
        width: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 20px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .input-message {
        flex: 1 0 0;
        -webkit-box-flex: 1;
        -ms-flex: 1 0 0px;
    }

    .input-message input {
        font-size: 16px;
        line-height: 20px;
        height: 100%;
        padding: 0 20px;
        background: transparent;
        border: 0;
        outline: none;
        font-family: Source Sans Pro,sans-serif;
    }


    .button-send {
        width: 26px;
        height: 26px;
        -webkit-box-flex: 0;
        -ms-flex: 0 0 26px;
        flex: 0 0 26px;
        -webkit-backface-visibility: hidden;
        -webkit-transition: all .3s;
        transition: all .3s;
        cursor: pointer;
    }
`;

const ChatBoxStyles = styled.div`
    .box-chat {
        background-color: rgb(45 24 108 / 12%);
        height: 80vh;
        width: 400px;
        position: fixed;
        right: 15px;
        bottom: 15px;
        border-radius: 20px;
        box-shadow: #BDBDBD 0px 0px 15px 3px;
        z-index: 999;
    }
    .header-box-chat {
        height: 80px;
        background: rgb(255, 255, 255);
        border-radius: inherit;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        align-items: start;
        margin: 0 !important;
    }

    img.avatar {
        height: 60px;
        width: 60px;
        border-radius: 50px;
    }
    .name-admin {
        font-size: 24px;
        line-height: 31px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden!important;
        text-overflow: ellipsis;
        padding-right: 15px;
        cursor: default;
    }
    .status {
        color: rgb(155, 166, 179);
        font-size: 15px;
        line-height: 19px;
        cursor: default;
    }
    .info-admin {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        margin-left: 10px
    }
    .content-box-chat {
        background: rgb(234, 238, 243);
        height: calc(80vh - 80px);
        width: 100%;
        border-radius: inherit;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
`;

const ListMessageStyle = styled.div`
    padding: 10px;
    height: 93%;
    max-height: 93%;
    overflow-y: scroll;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 20px 36px -28px inset;
`;