import { userLogin, userRegister } from '../redux/features/auth/authActions';
import store from '../redux/store'

export const handleLogin = (e, email, password, role) => {
    e.preventDefault();

    try {
        if(!role || !email || !password){
            return alert('All fields are required!');
        }
        store.dispatch(userLogin({email, password, role}));
    } catch (error) {
        console.log(error);
    }
};
export const handleRegister = (e,
    name,
    role,
    email,
    password,
    website,
    address,
    phone,
    organisationName,
    hospitalName) => {
        e.preventDefault();
        try {
            if(!name || !role || !email || !password || !website || !address || !phone || !organisationName || !hospitalName){
                return alert('All fields are required!');
            }
            store.dispatch(userRegister({email, password, role}));
        } catch (error) {
            console.log(error);
        }
    };