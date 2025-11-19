import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
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
    setLoading(true);

    console.log('🔄 Starting login process...');
    console.log('📧 Form data:', formData);

    try {
      const result = await login(formData.email, formData.password);
      console.log('📨 Login result:', result);
      
      if (result.success) {
        console.log('✅ Login successful, navigating to dashboard...');
        // Force navigation after a small delay to ensure state is updated
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        console.log('❌ Login failed:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('💥 Unexpected error:', error);
      setError('An unexpected error occurred');
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
              <h1 className="h2 fw-bold text-white">Welcome Back</h1>
              <p className="text-light">Sign in to your security dashboard</p>
            </div>

            {/* Login Form */}
            <Card className="glass border-cyber">
              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className="border-0 bg-danger bg-opacity-10 text-danger">
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
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
                  <Form.Group className="mb-4">
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
                        Signing In...
                      </>
                    ) : (
                      'Sign in to Dashboard'
                    )}
                  </Button>
                </Form>

                {/* Sign Up Link */}
                <div className="text-center mt-4 pt-3 border-top border-secondary">
                  <p className="text-light mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-cyber-blue text-decoration-none fw-semibold">
                      Sign up now
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

export default Login;