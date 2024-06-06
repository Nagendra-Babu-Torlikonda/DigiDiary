import React from 'react';
import './expenses.css';
import { DeleteRounded, AddCircleRounded } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';

function Expenses() {
  const user = useSelector((state) => state.user.value);

  const [show, setShow] = useState(false);
  const [transactionType, setTransactionType] = useState('');
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleTransactionTypeChange = (event) => {
    const type = event.target.value;
    setTransactionType(type);
    if (type === 'debit') {
      setCategories(['Rent', 'Groceries', 'Utilities','Food', 'Healthcare', 'Education', 'Entertainment', 'Others']);
    } else if (type === 'credit') {
      setCategories(['Salary', 'Business Income', 'Freelance Work', 'Investments', 'Rental Income', 'Others']);
    } else {
      setCategories([]);
    }
  };

  const deleteExpense = async (id) =>{
    try{
      const response = await axios.delete(`/expense/deleteExpense/${id}`);
      if(response.status === 200){
        alert("Expense deleted successfully");
      }
    }
    catch(error){
      setMessage("Unable to delete");
    }
  }

  const saveTransaction = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); 
    const t = Object.fromEntries(formData.entries());
    
    t.userId = user.userId;

        try {
            const response = await axios.post('/expense/addExpense', t);
            if (response.status === 200) {
                setTransactions([...transactions, response.data]);
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

    setTransactions([...transactions, t]);
    handleClose();
    event.target.reset();
  }

  useEffect(() => {
    if(user.userId){
    const fetchData = async () => {
        try {
            const response = await axios.get(`/expense/userExpenses/${user.userId}`);
            if (response.status === 200) {
                setTransactions(response.data);
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
}, [transactions]);

if(user.userId){

  return (
    <div>
      <div className='expense-container'>
      {message && <div className="text-danger text-sm mx-auto">{message}</div>}
        <div className='expense-header'>
        <p className='expense-heading'>Your Expenses</p>
        <input id="myexpenseSearch" type="text" placeholder="Search" />
        <Button variant='success' onClick={handleShow}>New Transaction <AddCircleRounded /></Button>

        <Modal show={show} onHide={handleClose} className='my-modal'>
                    <Modal.Header closeButton>
                    <Modal.Title>Add password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit={(event) => saveTransaction(event) }>
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
                        <Row>
                          <Form.Group as={Col} controlId="exampleForm.ControlInput2">
                            <Form.Label>Enter Amount</Form.Label>
                            <Form.Control type="number" name="amount" placeholder="Amount" required />
                          </Form.Group>

                          <Form.Group as={Col} controlId="exampleForm.ControlInput3">
                            <Form.Label>Transaction Type</Form.Label>
                            <Form.Control as="select" name="transactionType" value={transactionType} onChange={handleTransactionTypeChange} required>
                              <option value="">Select...</option>
                              <option value="debit">Debit</option>
                              <option value="credit">Credit</option>
                            </Form.Control>
                          </Form.Group>

                          <Form.Group as={Col} controlId="exampleForm.ControlInput4">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" name="category" required>
                              <option value="">Select...</option>
                              {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                              ))}
                            </Form.Control>
                          </Form.Group>

                        </Row>

                        <Row>
                          <Form.Group as={Col} controlId="exampleForm.ControlInput5">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" name="date" required />
                          </Form.Group>

                          <Form.Group as={Col} controlId="exampleForm.ControlInput6">
                            <Form.Label>Time</Form.Label>
                            <Form.Control type="time" name="time" required />
                          </Form.Group>
                        </Row>

                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput7">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name='description'
                            placeholder="Description"
                            required
                        />
                        </Form.Group>

                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="success" style={{float : 'right'}} type='submit'>Save</Button>
                      </Form>
                    </Modal.Body>
                    
                </Modal>

        </div>
        <div className='expense-list'>
          <div className='expense-debit'>
            <div className='expense-list-head'><h4>Debits</h4></div>
            <div className='expense-debit-list'>
              {transactions.filter((t) => t.transactionType === 'debit').map((t) => {
                return (
                  <div className='expense-list-item'>
                <div>
                  <p className='title'>{t.title}</p>
                  <p className='category'>{t.category}</p>
                  <DeleteRounded onClick = {() => deleteExpense(t.id)}/>
                  </div>
                  <h4>{t.amount}</h4>
                  <p>{t.description}</p>
                  <p>{t.date} {t.time}</p>
              </div>
                );
              })}
            </div>
          </div>
          <div className='expense-credit'>
            <div className='expense-list-head'><h4>Credit</h4></div>
              <div className='expense-credit-list'>
              {transactions.filter((t) => t.transactionType === 'credit').map((t) => {
                return (
                  <div className='expense-list-item'>
                <div>
                  <p className='title'>{t.title}</p>
                  <p className='category'>{t.category}</p>
                  <DeleteRounded onClick = {() => deleteExpense(t.id)}/>
                  </div>
                  <h4>{t.amount}</h4>
                  <p>{t.description}</p>
                  <p>{t.date}     {t.time}</p>
              </div>
                );
              })}
              </div>
          </div>
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

export default Expenses;