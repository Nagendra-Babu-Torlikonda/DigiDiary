import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <Container className="home-page">
      <Row className="text-center my-5">
        <Col>
          <h1 className="animate__animated animate__fadeInDown">Welcome to My Diary App</h1>
          <p className="lead animate__animated animate__fadeInDown">Your personal space for diaries, passwords, and expense tracking.</p>
        </Col>
      </Row>
      <Row>
        <Col md={4} className="animate__animated animate__fadeInLeft">
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Diary</Card.Title>
              <Card.Text>Write and manage your personal diaries.</Card.Text>
              <Link to="/diary">
                <Button variant="primary">Go to Diary</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="animate__animated animate__fadeInUp">
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Passwords</Card.Title>
              <Card.Text>Store and copy your passwords securely.</Card.Text>
              <Link to="/passwords">
                <Button variant="primary">Manage Passwords</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="animate__animated animate__fadeInRight">
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Expenses</Card.Title>
              <Card.Text>Track your expenses efficiently for financial management.</Card.Text>
              <Link to="/expenses">
                <Button variant="primary">Track Expenses</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
