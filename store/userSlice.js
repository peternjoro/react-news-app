import { createSlice } from "@reduxjs/toolkit";

// user session state
const initialState = {
    signedIn: false,
    auth_user: {userId:0,authToken: null,user_name:'',my_sources:[],my_categories:[],my_authors:[]},
    search_key: {},
    articles: []
}
const userSession = createSlice({
    name: 'user',
    initialState,
    reducers: {
        activeState(state,action){
            const payload = action.payload;
            if("signedIn" in payload){
                state.signedIn = payload.signedIn;
            }
            if("user" in payload){
                state.auth_user = payload.user;
            }
            if("search_key" in payload){
                state.search_key = payload.search_key;
            }
            if("articles" in payload){
                state.articles = payload.articles;
            }
        }
    }
});
export const { activeState } = userSession.actions;
export const loginStatus = state => state.user.signedIn;
export const authUser = state => state.user.auth_user;
export const searchKey = state => state.user.search_key;
export const curArticles = state => state.user.articles;
export default userSession.reducer;