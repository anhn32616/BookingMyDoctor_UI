
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase/config';
import userApi from 'api/userApi';
import { useSelector } from 'react-redux';


export const MessageContext = React.createContext();

export default function MessageProvider({ children }) {
  const [listMessage, setListMessage] = useState([]); // list messages chat with admin
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]); // messages chat all users
  const [users, setUsers] = useState([]);
  const [usersListFb, setUsersListFb] = useState([]);
  const [listMessageData, setListMessageData] = useState([]);
  const messageCollection = firestore.collection('messages');
  let currentUser = useSelector(states => states.user.profile)
  const token = localStorage.getItem('access_token');
  const [adminId, setAdminId] = useState();

  useEffect(() => {
    try {
      const getAdminId = async () => {
        var res = await userApi.getAdminId();
        console.log(res.data);
        setAdminId(res.data);
      }
      return () => getAdminId();

    } catch (error) {
      console.log(error.message);
    }
  })

  useEffect(() => {
    if (token) {
      const senderId = currentUser.id;
      const receiverId = adminId;
      if (adminId) {
        const userAdminRef = firestore.collection('messages').where('senderId', 'in', [senderId, receiverId])
          .where('receiverId', 'in', [senderId, receiverId]).orderBy('createAt', 'asc');
        userAdminRef.onSnapshot((querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            const messageData = doc.data();
            data.push(messageData);
          });
          setListMessage(data);
        })
      }
    }
  }, [adminId]);

  useEffect(() => {
    // let selectUser = selectedUser ? selectedUser : {id: -99};
    // if(!currentUser) currentUser = {id: -99};
    if (currentUser.id) {
      messageCollection.where('receiverId', '==', currentUser?.id)
        // .where('senderId', '==', selectUser?.id)
        .onSnapshot((querySnapshot) => {
          let listMessageData = [];
          querySnapshot.forEach((doc) => {
            listMessageData.push(doc.data())
          });
          setListMessageData((pre) => [...pre, ...listMessageData])
        });
    }
    // eslint-disable-next-line
  }, [currentUser]);

  useEffect(() => {
    // let selectUser = selectedUser ? selectedUser : {id: -99};
    // if(!currentUser) currentUser = {id: -99};
    if (currentUser.id) {
      messageCollection.where('senderId', '==', currentUser?.id)
        // .where('receiverId', '==', selectUser?.id)
        .onSnapshot((querySnapshot) => {
          let listMessageData = [];
          querySnapshot.forEach((doc) => {
            listMessageData.push(doc.data())
          })
          setListMessageData((pre) => [...pre, ...listMessageData])
        });
    }
    // eslint-disable-next-line
  }, [currentUser]);


  useEffect(() => {
    const userListFb = [];
    const lsm = listMessageData.sort((a, b) => b.createAt - a.createAt)

    lsm.forEach((messageData) => {
      const userId = messageData.senderId == currentUser.id ? messageData.receiverId : messageData.senderId;
      // Kiểm tra xem người dùng đã tồn tại trong danh sách chưa
      const existingUser = userListFb.find((user) => user.id === userId);

      // Nếu người dùng không tồn tại, thêm vào danh sách
      if (!existingUser) {
        userListFb.push({
          id: userId,
          lastMessage: {
            senderId: messageData.senderId,
            content: messageData.content
          },
        });
      }
    })
    setUsersListFb([...userListFb])
  }, [listMessageData])
  useEffect(() => {
    userApi.getBaseProfile().then((response) => {
      var usesDatabase = response?.data
      const userList = [];
      usersListFb.forEach(userFB => {
        var user = usesDatabase.find(u => u.id == userFB.id);
        user && userList.push({ ...user, ...userFB });
      })
      setUsers(userList);
    }).catch((e) => {
      console.log(e.messages);
    })
  }, [usersListFb])

  useEffect(() => {
    if (selectedUser) {
      var selectId = selectedUser.id;
      const unsubscribe = messageCollection
        .where('senderId', 'in', [currentUser.id, selectId])
        .where('receiverId', 'in', [currentUser.id, selectId])
        .orderBy('createAt')
        .onSnapshot((querySnapshot) => {
          const messageList = [];
          querySnapshot.forEach((doc) => {
            const messageData = doc.data();
            messageList.push(messageData);
          });
          setMessages(messageList);
        });
      return () => unsubscribe();
    } else {
      setMessages([]);
    }
    // eslint-disable-next-line
  }, [selectedUser]);


  return (
    <MessageContext.Provider
      value={{
        listMessage, currentUser, users, setUsers, selectedUser, setSelectedUser, messages, setMessages, adminId
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}
