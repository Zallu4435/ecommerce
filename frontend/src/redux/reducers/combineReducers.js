import { combineReducers } from "redux";
import themeReducer from '../slice/themeSlice'
import userReducer  from '../slice/userSlice'
import scrollReducer from '../slice/scrollSlice';

const rootReducer = combineReducers({
    theme: themeReducer,
    user: userReducer,
    scroll: scrollReducer,
})


export default rootReducer