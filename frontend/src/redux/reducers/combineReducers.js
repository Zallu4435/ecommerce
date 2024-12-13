import { combineReducers } from "redux";
import themeReducer from '../slice/themeSlice'
// import userReducer  from '../slice/userSlice'
import scrollReducer from '../slice/scrollSlice';

const defaultReducer = combineReducers({
    theme: themeReducer,
    scroll: scrollReducer,
})


export default defaultReducer