import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container, Row } from "react-bootstrap"
import { useAuth } from "../../../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { getFriendlyErrorMessage } from '../../../utils/errorUtils';
import styles from './Signin.module.css';


export default function Signup() {
  const userNameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(userNameRef.current.value, emailRef.current.value, passwordRef.current.value)
      navigate("/dashboard")
    } catch (error) {
        console.log("The error was ")
        setError(getFriendlyErrorMessage(error))
    }

    setLoading(false)
  }

  return (
    <Container className={`justify-content-center ${styles.centerContainer}`} style={{display: "flex"}} >
      <Row className="align-items-center">
      <Card className={`${styles.cardMaxWidth}`}>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} className={`${styles.formGroup}`}>
            <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" ref={userNameRef} required />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className={`w-100 ${styles.OrangeButton}`} type="submit">    
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login" style={{color:"#F0AF4D"}}>Log In</Link>
      </div>
      </Row>

    </Container>
  )
}