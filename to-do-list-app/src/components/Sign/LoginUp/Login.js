import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container, Row } from "react-bootstrap"
import { useAuth } from "../../../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { getFriendlyErrorMessage } from '../../../utils/errorUtils';
import styles from './Signin.module.css';


export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value.trim(), passwordRef.current.value)
      navigate("/Dashboard")
    } catch (error) {
      setError(getFriendlyErrorMessage(error))
    }

    setLoading(false)
  }

  return (
    <Container className={`justify-content-center ${styles.centerContainer}`} style={{display: "flex"}} >
      <Row>
        <Card className={`${styles.cardMaxWidth}`}>          
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className={`${styles.formGroup}`}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Button disabled={loading} className={`w-100 ${styles.OrangeButton}`} type="submit">
              {loading ? (
                <>
                  <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                  <span className="sr-only">Loading...</span>
                </>
              ) : (
                "Log In"
              )}
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/forgot-password" style={{color: "#F0AF4D"}}>Forgot Password?</Link>
            </div>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Need an account? <Link to="/signup" style={{color: "#F0AF4D"}}>Sign Up</Link>
        </div>
      </Row>
    </Container>
  )
}