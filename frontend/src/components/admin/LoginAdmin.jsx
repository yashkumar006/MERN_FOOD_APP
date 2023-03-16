import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserData } from '../../App';
import ToastAlert from '../toastMessage/ToastAlert';
import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';

const LoginAdmin = () => {
    
    const { userDispatch } = useContext(UserData);
    const [userdata, setUserdata] = useState({email: '', password: ''});
    const navigate = useNavigate();
    const [toast, setToast] = useState({message: '', type: ''})
    const [showToastMessage, setShowToastMessage] = useState(false)
    const API = process.env.REACT_APP_URL;

    //LOGIN USER
    const saveData = async (e)=> {
        e.preventDefault();
        const {email, password} = userdata; 

        if(!email || !password) {
            alert("Enter Details")
        }else if (password.length < 5) {
            alert("Min Password Length: 5")
        } else {
                const res = await fetch(`${API}/loginadmin`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: userdata.email,
                    password: userdata.password})
                });
                const json = await res.json();
                
                if(res.status === 200) {
                    const {name, email, phone, address} = json.admin;
                    const userDetails = {isAuth: true, isAdmin: true, name, email, phone, address}
                    localStorage.setItem("authToken", json.authToken);
                    if(localStorage.getItem("authToken")) {
                        localStorage.setItem("userDetails", JSON.stringify(userDetails))
                        userDispatch({type: "USER", isAuthenticated: true, isAdmin: true, name: name, email: email, phone: phone, address: address })
                        navigate('/home')
                    }
                } else if(res.status === 400) {
                    setToast({message: json.message, type: 'danger'})
                    setShowToastMessage(true)
                    setTimeout(() => {
                        setShowToastMessage(false)
                        setToast({message: '', type: ''})
                    }, 2000);
                } else {
                    alert("Error Occured")
                }
        }
    };

    // HANDLE INPUTS
    const handleInputs = (e)=> {
        const name = e.target.name;
        const value = e.target.value;

        setUserdata({...userdata, [name]: value})
    };

  return (
    <>
        <div className="main_container">
            <h2 className='m-4 fw-bold'>Login Here</h2>
            <Form method='POST' onSubmit={saveData} className='border h-50 login_box border-info p-3 rounded-2 bg-light fs-5 w-25'>
                <Form.Group className="m-2" controlId="formBasicEmail">
                    <Form.Label className=''>Email address</Form.Label>
                    <div className='input_wrapper'>
                    <Form.Control className='input' type="email" name='email' required={true} onChange={handleInputs} value={userdata.email} placeholder="Enter email" />
                    <AiOutlineMail className='input_icon'/>
                    </div>
                </Form.Group>
                <Form.Group className="m-2" controlId="formBasicPassword">
                    <Form.Label className=''>Password</Form.Label>
                    <div className='input_wrapper'>
                        <Form.Control className='input' type="password" name='password' required={true} onChange={handleInputs} value={userdata.password} placeholder="Password" />
                        <RiLockPasswordLine className='input_icon'/>
                    </div>
                </Form.Group>
                <Form.Group className='mt-4 mx-auto container'>
                    <Button variant="success" className='fw-bold w-100 mb-2 button'>
                        Login
                    </Button>
                    {showToastMessage ? <ToastAlert toast={toast} /> : null}
                    <div className='text-center'>
                        <Form.Text>New here, 
                            <NavLink to='/registeradmin' style={{textDecoration: "none"}}> Register</NavLink> Now
                        </Form.Text>
                    </div>
                </Form.Group>
                </Form>
        </div>
    </>
  )
}

export default LoginAdmin