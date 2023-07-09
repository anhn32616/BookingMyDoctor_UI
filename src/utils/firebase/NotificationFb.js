import { useEffect, useState } from 'react';
import { firestore } from '../../firebase/config';
import { useSelector } from 'react-redux';

export const useNotifications = () => {
    let userId = useSelector(state => state.user.profile.id)
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if(!userId) userId = -1; 
        const unsubscribe = firestore.collection('notifications')
          .where('userId', '==', userId).orderBy('dateCreated','desc') 
          .onSnapshot((snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setNotifications(data);
          });
    
        return () => {
          unsubscribe();
        };
      }, [userId]); 
    
      return notifications;

}

export const addNotification = (userId, message) => {
    // Thêm thông báo mới vào collection 'notifications'
    firestore.collection('notifications').add({
        userId,
        message,
        dateCreated: new Date().toISOString(),
        read: false,
    });
};

export const markNotificationAsRead = async (notificationId) => {
    await firestore.collection('notifications').doc(notificationId).update({
        read: true,
    });
};



