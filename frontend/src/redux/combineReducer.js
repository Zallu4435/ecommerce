import { combineReducers } from "redux";
import themeReducer from './themeSlice'
import authReducer from './authSlice'
import scrollReducer from './scrollSlice';


const rootReducer = combineReducers({
    theme: themeReducer,
    auth: authReducer,
    scroll: scrollReducer,
})


export default rootReducer