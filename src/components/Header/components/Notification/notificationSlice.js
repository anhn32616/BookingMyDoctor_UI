import notificationApi from '../../../../api/notificationApi'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

export const getNotifies = createAsyncThunk(
    'notification/getNotifies',
    async (payload, { rejectWithValue }) => {
        try {
            const { userId, token } = payload
            const respone = await notificationApi.getNotification(userId, {
                headers: {
                    Authorization: token
                }
            })
            return respone.message
        }
        catch (err) {
            return rejectWithValue(err)
        }
    }
)
// export const update = createAsyncThunk(
//     'users/update',
//     async (payload, { rejectWithValue }) => {
//         try {
//             const data = await userApi.updateInfoUser(payload, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     Authorization: `${localStorage.getItem(
//                         'access_token'
//                     )}`
//                 }
//             })
//             localStorage.setItem('user', JSON.stringify(data.message))
//             return data.message
//         } catch (err) {
//             return rejectWithValue(err)
//         }
//     }
// )

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notificationList: []
    },
    reducers: {
        createNotify(state, action) {
            state.notificationList = [action.payload, ...state.notificationList]
        }
    },
    extraReducers: {
        [getNotifies.fulfilled]: (state, action) => {
            state.notificationList = action.payload
        }
    }
})
const { reducer, actions } = notificationSlice
export const { createNotify } = actions
export default reducer