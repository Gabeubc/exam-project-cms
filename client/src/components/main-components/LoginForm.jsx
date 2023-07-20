/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../sub-components/NavBar'
import API from '../../common/API'

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        if(!user){
          setErrorMessage('Invalid username or password');
        }else{
          setErrorMessage('');
          props.loginSuccessful(user);
          props.interfaceSetStatePageUpdate(true);
        }
      })
      .catch(err => {
        // NB: Generic error message, should not give additional info (e.g., if user exists etc.)
        setErrorMessage('Wrong username or password');
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };

    // SOME VALIDATION, ADD MORE if needed (e.g., check if it is an email if an email is required, etc.)
    let valid = true;
    if (username === '' || password === '')
      valid = false;

    if (valid) {
      doLogIn(credentials);
    } else {
      // TODO: show a better error message...
      setErrorMessage('Error(s) in the form, please fix it/them.')
    }
  };

  return (
    <>
      <NavBar interfaceSetStatePageUpdate={props.interfaceSetStatePageUpdate}/>
      <Container className='custom-login-container'>
        <Row>
          <Col xs={3}></Col>
          <Col xs={6}>
            <h2>Login</h2>
            <Form onSubmit={handleSubmit}>
              {errorMessage ? <Alert variant='danger' dismissible onClick={() => setErrorMessage('')}>{errorMessage}</Alert> : ''}
              <Form.Group controlId='username'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' /*value={username}*/ onChange={ev => setUsername(ev.target.value)} placeholder='username'/>
              </Form.Group>
              <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' /*value={password}*/ onChange={ev => setPassword(ev.target.value)} placeholder='password'/>
              </Form.Group>
              <Button className='my-2' type='submit'>Login</Button>
              <Button className='my-2 mx-2' variant='danger' onClick={() => navigate('/')}>Cancel</Button>
            </Form>
          </Col>
          <Col xs={3}></Col>
        </Row>
      </Container>
    </>
  )
}

export { LoginForm };