import React from 'react'
import Form from '../../components/Shared/Form/Form'
import { UseSelector, useSelector } from 'react-redux'
import Spinner from '../../components/Shared/Spinner'
import { toast } from 'react-toastify'

const Login = () => {
    const {loading, error} = useSelector(state => state.auth)
    return (
        <>
        {error && <span>{alert(error)}</span>}
            {loading ? (
                <Spinner />
            ) : (
                <div className="row g-0">
                    <div className="col-md-8 form-banner">
                        <img src="./assets/images/banner1.jpg" alt="LoginBanner" />
                    </div>
                    <div className="col-md-4 form-container">
                        <Form 
                            SubmitBtn={"Login"}
                            formTitle={"User Login"}
                            formType={'login'}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default Login