import userApi from 'api/userApi'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')
export const setListUser = createAsyncThunk(
    'listUser/setListUser',
    async (payload, { rejectWithValue }) => {
        const getDataUserById = (id) => {
            return userApi.getUserById(id, {
                headers: {
                    Authorization: `${localStorage.getItem(
                        'access_token')}`
                }
            })
        }
        try {
            const UserResult = []
            const allPromises = payload.map(user => getDataUserById(user.id))
            await Promise.all(allPromises).then(resultArr => {
                resultArr.forEach(resultItem => {
                    UserResult.push(resultItem.user)
                })
            })
                .catch(err => console.log(err))

            return UserResult
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const listUserSlice = createSlice({
    name: 'listUser',
    initialState: {
        listUser: []
    },
    reducers: {

    },
    extraReducers: {
        [setListUser.fulfilled]: (state, action) => {
            state.listUser = action.payload
        }
    }
})
const { reducer } = listUserSlice
export default reducer