import React, { useState, useEffect } from 'react';
import './passwords.css';
import { ContentCopyRounded, VisibilityRounded, AddCircleRounded, DeleteRounded } from '@mui/icons-material';
import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import $ from 'jquery';
import axios from 'axios';

function Password() {
  const user = useSelector((state) => state.user.value);

  const [show, setShow] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [passworddata, setPassworddata] = useState([]);
  const [message, setMessage] = useState("");

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const copyToClipboard = (pass) => {
    navigator.clipboard.writeText(pass).then(() => {
      alert('Password copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleSearch = () => {
        const value = $('#myPasswordSearch').val().toLowerCase();
        $('.passwords-list-item').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    };

  const savePassword = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); 
    const p = Object.fromEntries(formData.entries());

    p.userId = user.userId;

        try {
            const response = await axios.post('/passwords/addPassword', p);
            if (response.status === 200) {
                setPassworddata([...passworddata, response.data]);
            } else {
                setMessage("Unexpected response from server. Please try again.");
            }
        } catch (error) {
            if (error.response) {
                setMessage("Error in saving data");
            } else if (error.request) {
                setMessage("No response received from the server.");
            } else {
                setMessage("An error occurred. Please try again.");
            }
        }

        setPassworddata([...passworddata, p]);
        setInputPassword("");
        event.target.reset(); // Clear the form inputs
        setShow(false);
  }


  useEffect(() => {
    if(user.userId){
    const fetchData = async () => {
        try {
            const response = await axios.get(`/passwords/userPasswords/${user.userId}`);
            if (response.status === 200) {
                setPassworddata(response.data);
            }
        } catch (error) {
            if (error.response) {
                setMessage("Error Encountered: " + error.response.status);
            } else if (error.request) {
                setMessage('No response received from the server.');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    }
    fetchData();
}
}, [passworddata]);


  const viewPassword = (pass) => {
    alert(pass);
  }

  const generatePassword = () => {
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?';
    const allCharacters = upperCaseLetters + lowerCaseLetters + numbers + specialCharacters;

    let password = '';
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters[randomIndex];
    }
    setInputPassword(password);
  }

  const deletePassword = async (id) => {

    try{
      const response = await axios.delete(`/passwords/deletePassword/${id}`);
      if(response.status === 200){
        alert("Password deleted successfully");
      }
    }
    catch(error){
      setMessage("Unable to delete");
    }
  }
  if(user.userId){

  return (
    <div>
      <div className='passwords-container'>
        {message && <div className="text-danger text-sm mx-auto">{message}</div>}
        <div className='passwords-heading-container'>
        <p className='passwords-heading'>Your passwords</p>
        <input id="myPasswordSearch" type="text" placeholder="Search" onKeyUp={handleSearch} />
        <Button variant='success' onClick={handleShow}>New Password <AddCircleRounded /></Button>

        <Modal show={show} onHide={handleClose} className='my-modal'>
                    <Modal.Header closeButton>
                    <Modal.Title>Add password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit={(event) => savePassword(event)}>
                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                        <Form.Label>Enter Title</Form.Label>
                        <Form.Control
                            type="text"
                            name='title'
                            placeholder="Title"
                            autoFocus
                            required
                        />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput2">
                        <Form.Label>Enter Username</Form.Label>
                        <Form.Control
                            type="text"
                            name='username'
                            placeholder="Username"
                            required
                        />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput3">
                        <Form.Label>Enter URL</Form.Label>
                        <Form.Control
                            type="text"
                            name='url'
                            placeholder="URL"
                            required
                        />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput4">
                        <Form.Label>Enter Password</Form.Label>
                        <Form.Control
                            type="password"
                            name='password'
                            placeholder="Password"
                            value={inputPassword} 
                            onChange={(e) => setInputPassword(e.target.value)}
                            required
                        />
                        </Form.Group>

                        <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" style={{marginLeft : '20px'}} onClick={generatePassword} className = "ml-2" >
                        Generate
                    </Button> 
                    <Button variant="success" style={{float : 'right'}} type='submit'>
                        Save 
                    </Button>
                    </Form>
                    </Modal.Body>
                    
                </Modal>

        </div>
        <div className='passwords-list'>
          {
            passworddata.map((p) => {
              return (
                <div className='passwords-list-item'>
                  <h4>{p.title}</h4>
                  <p>User Name : {p.username}</p>
                  <div class='passwords-icons'>
                    <a href={p.url} target='_blank' rel="noopener noreferrer">{p.url}</a>
                    <ContentCopyRounded  onClick = {() => copyToClipboard(p.password)}/>
                    <VisibilityRounded  onClick = {() => viewPassword(p.password)}/>
                    <DeleteRounded onClick = {() => deletePassword(p.id)} />
                  </div>
                </div>
              )
            })
          }
          
        </div>
      </div>
    </div>
  );}
  else{
    return(
      <div className='container'>
      <h2 className='text-center display-2'>Please Login</h2>
  </div>
  );
  }
}

export default Password;