import React, {  useState } from 'react';
import './loginpage.css';
import { useDispatch } from 'react-redux';
import { login, signup } from '../../features/user';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { event } from 'jquery';

function LoginPage() {
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('login');
    const [showModal, setShowModal] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpMessage, setOtpMessage] = useState("");
    const [otp, setOtp] = useState();
    const [message, setMessage] = useState("");
    const [forgotemail, setForgotemail] = useState("");
    const [showNewModal, setShowNewModal] = useState(false);


    const handleForgotPasswordClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseNewModal = () => {
        setShowNewModal(false);
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const onLoginSubmit = async (event) => {
        event.preventDefault(); 
        const formData = new FormData(event.target);
        const loginData = Object.fromEntries(formData.entries()); 
        try {
            const response = await axios.post('/user/userLogin',loginData);

            if (response.status === 200) {
                alert("login successfull");
                dispatch(login(response.data));
            }
        } catch (error) {
            if (error.response) {
                        setMessage('An error occurred. Please try again.');
            } else if (error.request) {
                setMessage('No response received from the server.');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
        event.target.reset();
    }

    const onSignUpSubmit = async (event) => {
        event.preventDefault();
        setMessage("")
        const formData = new FormData(event.target);
        const signUpData = Object.fromEntries(formData.entries());
        try{
            const response = await axios.post("/user/addUser", signUpData)
                if(response.status === 200)
                    {
                    alert("Registration Successful");
                    event.target.reset();
                    setActiveTab("login");
                }
        }catch (error) {
            if (error.response) {
                        setMessage('An error occurred. Please try again.');
            } else if (error.request) {
                setMessage('No response received from the server.');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
      }

    
    const sendOTP = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const e = formData.get("email");
        setForgotemail(e);
        try{
        const response = await axios.post("/user/forgotPassword", e)
                if(response.status === 200)
                    {
                        setOtp(response.data);
                        setOtpMessage("OTP sent to email");
                        setOtpSent(true);
                }
        }catch (error) {
            if (error.response.status === 404)
                setOtpMessage(error.response.body);
            if (error.response) {
                    setMessage('An error occurred. Please try again. Are you sure account exists');
                    setShowModal(false);
            } else if (error.request) {
                setMessage('No response received from the server.');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    }

    const verifyOtp = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const o = formData.get("inputotp");
        if(Number(o) === otp)
        {
            setShowModal(false);
            setShowNewModal(true);
        }
    }

    const changePassword = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const p = formData.get("newpassword");
        const c = formData.get("confirmpassword");
        if(p === c){
            const obj = { "password" : p, "email" : forgotemail}
            try{
                const response = await axios.post("/user/newPassword", obj);
                if(response.status === 200){
                    alert("password changed succssfully");
                    event.target.reset();
                    setShowNewModal(false);
                }
        }catch(error){
            setShowNewModal(false);
            setMessage("error occured. please try again")
        }
        }
    }

    return (
        <div className="login-page">
            <div className="toggle-buttons">
            <button className={activeTab === 'signup' ? 'active' : ''} onClick={() => handleTabClick('signup')}>Sign Up</button>
            <button className={activeTab === 'login' ? 'active' : ''} onClick={() => handleTabClick('login')}>Login</button>
            </div>
            <div className='forms'>
            {message && <div className="text-danger text-sm mx-auto">{message}</div>}
            <div className='sign-up-form' id={activeTab === 'login' ? 'inactive': ''}>
                    <h1 className='form-heading'>Create an Account</h1><br/>
                    <form className='form' onSubmit={(event) => onSignUpSubmit(event)} method='post'>
                        <div className="row mb-2">
                            <div className="col">
                                <label htmlFor="username">User Name:</label>
                                <input type="text" className="form-control" name="username" required/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col mb-2">
                                <label htmlFor="gender">Gender:</label>
                                <select className="form-select" name="gender" required>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>
                            <div className="col mb-2">
                                <label htmlFor="dob">Date of Birth:</label>
                                <input type="date" className="form-control" name="dob" required/>
                            </div>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" name="email" required/>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="password">Password:</label>
                            <input type="password" className="form-control" name="password" required/>
                        </div>
                        <input type='submit' className="btn btn-primary mb-5" value='Sign Up' />
                    </form>
                </div>

                <div className='login-form' id={activeTab === 'signup' ? 'inactive' : ''}>
                    <h1 className='form-heading'>Login</h1>
                    <form className='form' onSubmit={(event) => onLoginSubmit(event)} method='post'>

                    <div className="mb-2">
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" name="email" />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="password">Password:</label>
                            <input type="password" className="form-control" name="password" />
                            <a href="#" className="forgot-password-link" onClick={handleForgotPasswordClick}>Forgot Password?</a>
                        </div>
                        <button type='submit' className="btn btn-primary mb-5" value='Sign Up' >Login</button>

                    </form>

                    <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Forgot Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please enter your email for resetting password. We will send you an OTP .</p>
                    <form className='form' onSubmit={(event) => sendOTP(event)}>
                        <div className='row mb-3'>
                            <div className='col'>
                                <input type="email" name='email' className="form-control" placeholder="Email" disabled={otpSent} />
                                {otpMessage && <div className="text-success text-sm mx-auto">{otpMessage}</div>}
                            </div>
                            <div className='col-3'>
                                <Button variant="primary" type='submit' className="w-100">
                                Send OTP
                            </Button>
                            </div>
                        </div>
                    </form>
                    <form onSubmit={(event) => verifyOtp(event)}>
                        <div className='row mb-3'>
                            <div className='col'>
                                <input type="text" name='inputotp' pattern='[0-9]{6}' className="form-control" 
                                    inputMode="numeric" placeholder="Enter OTP" disabled={!otpSent}
                                    onKeyDown={(e) => {
                                        if (!/^\d$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^\d]/g, '').slice(0, 6);
                                    }} />
                            </div>
                            <div className='col-3'>
                                <Button variant="primary" type='submit' className="w-100" disabled={!otpSent}>
                                Verify
                            </Button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>
                </div>

                <Modal show={showNewModal} onHide={handleCloseNewModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter New Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please enter new password for {forgotemail}</p>
                    <form className='form' onSubmit={(event) => changePassword(event)}>
                        <div className='row mb-3 w-100'>
                            <div className='col'>
                                <input type="password" name='newpassword' className="form-control" placeholder="New Password" />
                            </div>
                        </div>

                        <div className='row mb-3 w-100'>
                            <div className='col'>
                                <input type="password" name='confirmpassword' className="form-control" placeholder="Confirm Password" />
                            </div>
                        </div>
                        <Button variant="primary" type='submit' >
                                Change Password
                            </Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>

            </div>
        </div>
    );
}

export default LoginPage;
