import { REGISTER_SUCCESS, REGISTER_FAIL } from './types';
import {setAlert} from './alert';
import axios from 'axios';

//Register User

export const register = ({name, email, password}) => async dispatch => {
    const config ={
        headers:{
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({name, email, password});
    try{
        const res = await axios.post('/api/users', body, config);
        console.log(res);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
    }catch(err){
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach( error => dispatch(setAlert(error.msg, 'danger', 5000)))
        }
        dispatch({
            type:REGISTER_FAIL
        })
    }
}
