import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-custom min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            {/* Header */}
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none d-inline-block mb-3">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="bg-gradient rounded-circle p-2 me-3" 
                       style={{background: 'linear-gradient(135deg, var(--cyber-blue), var(--cyber-green))'}}>
                    <Shield className="text-dark" size={28} />
                  </div>
                  <span className="gradient-text h2 mb-0 fw-bold">BreachAlert</span>
                </div>
              </Link>
              <h1 className="h2 fw-bold text-white">Create Account</h1>
              <p className="text-light">Join thousands protecting their digital identity</p>
            </div>

            {/* Register Form */}
            <Card className="glass border-cyber">
              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className="border-0 bg-danger bg-opacity-10 text-danger">
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light fw-semibold">Full Name</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-end-0">
                        <User className="text-cyber-blue" size={20} />
                      </span>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        className="form-cyber border-start-0"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </Form.Group>

                  {/* Email Field */}
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light fw-semibold">Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-end-0">
                        <Mail className="text-cyber-blue" size={20} />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="form-cyber border-start-0"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-3">
                    <Form.Label className="text-light fw-semibold">Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-end-0">
                        <Lock className="text-cyber-blue" size={20} />
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className="form-cyber border-start-0"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </Form.Group>

                  {/* Confirm Password Field */}
                  <Form.Group className="mb-4">
                    <Form.Label className="text-light fw-semibold">Confirm Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-end-0">
                        <Lock className="text-cyber-blue" size={20} />
                      </span>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        className="form-cyber border-start-0"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </Form.Group>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="btn-cyber w-100 py-2 fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Creating Account...
                      </>
                    ) : (
                      'Create Secure Account'
                    )}
                  </Button>
                </Form>

                {/* Sign In Link */}
                <div className="text-center mt-4 pt-3 border-top border-secondary">
                  <p className="text-light mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-cyber-blue text-decoration-none fw-semibold">
                      Sign in
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;