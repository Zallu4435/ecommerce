import { combineReducers } from "redux";
import themeReducer from '../slice/themeSlice'
import scrollReducer from '../slice/scrollSlice';

const defaultReducer = combineReducers({
    theme: themeReducer,
    scroll: scrollReducer,
})


export default defaultReducer