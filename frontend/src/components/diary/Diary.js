import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { DeleteRounded, EditRounded, ArrowForwardIosRounded, AddCircleRounded } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import axios from 'axios';
import $ from 'jquery';
import './diary.css';

function Diary() {
    const user = useSelector((state) => state.user.value);

    const [showAdd, setShowAdd] = useState(false);
    const [showView, setShowView] = useState(false);
    const [selectedDiary, setSelectedDiary] = useState(null);
    const [data, setData] = useState([]);
    const [message, setMessage] = useState("");

    const handleAddClose = () => setShowAdd(false);
    const handleAddShow = () => setShowAdd(true);

    const handleViewClose = () => setShowView(false);
    const handleViewShow = (diary) => {
        setShowView(true);
        setSelectedDiary(diary);
    }

    const handleSearch = () => {
        const value = $('#search-diary').val().toLowerCase();
        $('.diary-list-item').each(function () {
            const title = $(this).find('.title').text().toLowerCase();
            const content = $(this).find('.content').text().toLowerCase();
            if (title.indexOf(value) > -1 || content.indexOf(value) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    };

    const editDiary = (id) => {
        console.log(id);
    }

    const deleteDiary = async (id) => {
        try{
            const response = await axios.delete(`/diary/deleteDiary/${id}`);
            if(response.status === 200){
              alert("Diary deleted successfully");
            }
          }
          catch(error){
            setMessage("Unable to delete");
          }
        setShowView(false);
        setSelectedDiary(null);
    }

    const saveDiary = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const d = Object.fromEntries(formData.entries());
        d.userId = user.userId;

        try {
            const response = await axios.post('/diary/addDiary', d);
            if (response.status === 200) {
                setData([...data, response.data]);
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

        setData([...data, d]);
        event.target.reset(); // Clear the form inputs
        setShowAdd(false);
    }

    useEffect(() => {
        if(user.userId){
        const fetchData = async () => {
            try {
                const response = await axios.get(`/diary/userDiaries/${user.userId}`);
                if (response.status === 200) {
                    setData(response.data);
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
    }, [data]);

    if(user.userId){

    return (
        <div className='diary-page'>
            {message && <div className="text-danger text-sm mx-auto">{message}</div>}
            <div className='diary-container'>
                <div className='diary-header'>
                    <div className='diary-heading'><h3>Your Pages</h3></div>
                    <input id="search-diary" type="text" placeholder="Search" onKeyUp={handleSearch} />
                    <Button variant='success' onClick={handleAddShow}>New Diary <AddCircleRounded /></Button>

                    <Modal show={showAdd} onHide={handleAddClose} className='my-modal'>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Diary</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={saveDiary} method='post'>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Enter Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='title'
                                                placeholder="Title"
                                                autoFocus
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                                            <Form.Label>Date</Form.Label>
                                            <Form.Control type="datetime-local" name="date" required />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Enter Content</Form.Label>
                                    <Form.Control as="textarea" name='content' rows={10} required />
                                </Form.Group>
                                <Button variant="secondary" onClick={handleAddClose}>
                                    Close
                                </Button>
                                <Button variant="primary" style={{ float: 'right' }} type='submit'>
                                    Save
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div>
                <div className='diary-list'>
                    {data.map((d) => {
                        return (
                            <div className='diary-list-item' onClick={() => handleViewShow(d)} key={d.id}>
                                <div className='diary-list-item-check'><ArrowForwardIosRounded /></div>
                                <div className='diary-list-item-title'>
                                    <p className='title'>{d.title}</p>
                                    <p>{d.content}</p>
                                </div>
                                <div className='diary-list-item-edit'>
                                    <EditRounded onClick={(id) => editDiary(d.id)} />
                                </div>
                                <div className='diary-list-item-delete'>
                                    <DeleteRounded sx={{ color: red[600] }} onClick={(e) => { e.stopPropagation(); deleteDiary(d.id); }} />
                                </div>
                                <div className='diary-list-item-date'>
                                    <p>{d.date}</p>
                                </div>
                            </div>
                        );
                    })}
                    <Modal show={showView} onHide={handleViewClose} centered>
                        {selectedDiary && (
                            <>
                                <Modal.Header closeButton>
                                    <Modal.Title>{selectedDiary.title}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>{selectedDiary.content}</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleViewClose}>
                                        Close
                                    </Button>
                                    <Button variant="danger" onClick={() => deleteDiary(selectedDiary.id)}>
                                        Delete
                                    </Button>
                                </Modal.Footer>
                            </>
                        )}
                    </Modal>
                </div>
            </div>
        </div>
    );
}
else
{
    return(
        <div className='container'>
        <h2 className='text-center display-2'>Please Login</h2>
    </div>
    );
    
}
}

export default Diary;
