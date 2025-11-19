import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Navbar, Nav, Modal, Spinner } from 'react-bootstrap';
import { Shield, User, Mail, Bell, LogOut, Plus, AlertTriangle, CheckCircle, Eye, RefreshCw, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanningEmail, setScanningEmail] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [showScanModal, setShowScanModal] = useState(false);

  // Fix: Don't redirect immediately, check if user exists first
 // In Dashboard.jsx - Fix the redirect logic
useEffect(() => {
  // Only redirect if user is null AFTER loading is complete
  if (!loading && !user) {
    console.log('No user found, redirecting to login...');
    navigate('/login');
  }
}, [user, loading, navigate]);

// Load monitored emails only when user exists
useEffect(() => {
  if (user && !loading) {
    console.log('Loading emails for user:', user.email);
    loadEmails();
  }
}, [user, loading]);

  const loadEmails = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/emails');
      if (response.ok) {
        const data = await response.json();
        setEmails(data);
      }
    } catch (error) {
      console.error('Failed to load emails:', error);
    }
  };

  const addEmail = async (e) => {
    e.preventDefault();
    if (!newEmail) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail })
      });

      if (response.ok) {
        const data = await response.json();
        setEmails(prev => [...prev, data]);
        setNewEmail('');
        
        // Auto-scan the new email
        setTimeout(() => {
          scanEmail(data.email);
        }, 500);
      } else {
        alert('Failed to add email');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scanEmail = async (email) => {
    setScanningEmail(email);
    try {
      const response = await fetch('http://localhost:5000/api/scans/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        const result = await response.json();
        setScanResult(result.data);
        setShowScanModal(true);
        
        // Refresh emails to update the table
        loadEmails();
      } else {
        alert('Scan failed. Please try again.');
      }
    } catch (error) {
      alert('Network error during scan.');
    } finally {
      setScanningEmail(null);
    }
  };

  const removeEmail = async (email) => {
    if (window.confirm(`Are you sure you want to stop monitoring ${email}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/emails/${encodeURIComponent(email)}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setEmails(prev => prev.filter(e => e.email !== email));
        } else {
          alert('Failed to remove email');
        }
      } catch (error) {
        alert('Network error. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const refreshAllEmails = async () => {
    setLoading(true);
    try {
      for (const email of emails) {
        await scanEmail(email.email);
        // Small delay between scans
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalBreaches = emails.reduce((sum, email) => sum + (email.breachCount || 0), 0);
  const compromisedEmails = emails.filter(email => (email.breachCount || 0) > 0).length;
  const secureEmails = emails.filter(email => (email.breachCount || 0) === 0).length;

  const stats = [
    { 
      title: 'Monitored Emails', 
      value: emails.length, 
      icon: Mail, 
      color: 'primary',
      description: 'Emails being monitored'
    },
    { 
      title: 'Total Breaches', 
      value: totalBreaches, 
      icon: AlertTriangle, 
      color: 'danger',
      description: 'Breaches detected across all emails'
    },
    { 
      title: 'Compromised Emails', 
      value: compromisedEmails, 
      icon: AlertTriangle, 
      color: 'warning',
      description: 'Emails with breaches'
    },
    { 
      title: 'Secure Emails', 
      value: secureEmails, 
      icon: CheckCircle, 
      color: 'success',
      description: 'Emails with no breaches'
    }
  ];

  // Show loading if no user
  if (!user) {
    return (
      <div className="bg-dark-custom min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" className="text-cyber-blue" />
          <p className="text-light mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-custom min-vh-100">
      {/* Navigation */}
      <Navbar expand="lg" className="navbar-cyber">
        <Container>
          <Navbar.Brand className="d-flex align-items-center">
            <div className="bg-cyber-gradient rounded-circle p-2 me-3">
              <Shield className="text-white" size={24} />
            </div>
            <span className="gradient-text h4 mb-0 fw-bold">BreachAlert</span>
          </Navbar.Brand>
          
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Item className="d-flex align-items-center me-3">
              <User className="text-light me-2" size={20} />
              <span className="text-light">{user.name || user.email || 'User'}</span>
            </Nav.Item>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              <LogOut className="me-2" size={16} />
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="py-4">
        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            <Card className="glass border-cyber">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h1 className="h2 fw-bold text-white mb-2">
                      Welcome back, {user.name || user.email || 'User'}! 👋
                    </h1>
                    <p className="text-light mb-0">
                      Your digital identity is currently being monitored across known data breaches.
                    </p>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    onClick={refreshAllEmails}
                    disabled={loading || emails.length === 0}
                  >
                    <RefreshCw className="me-2" size={16} />
                    Refresh All
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Stats Grid */}
        <Row className="mb-4">
          {stats.map((stat, index) => (
            <Col md={6} lg={3} key={index} className="mb-3">
              <Card className="card-cyber h-100 border-cyber">
                <Card.Body className="text-center p-4">
                  <div className={`bg-${stat.color} bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3`}>
                    <stat.icon className={`text-${stat.color}`} size={24} />
                  </div>
                  <h3 className="text-white fw-bold">{stat.value}</h3>
                  <p className="text-light mb-1">{stat.title}</p>
                  <small className="text-secondary">{stat.description}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Add Email Section */}
        <Row className="mb-4">
          <Col>
            <Card className="glass border-cyber">
              <Card.Body className="p-4">
                <h5 className="text-white fw-bold mb-3">
                  <Plus className="me-2" size={20} />
                  Add Email to Monitor
                </h5>
                <Form onSubmit={addEmail} className="d-flex gap-2">
                  <Form.Control
                    type="email"
                    placeholder="Enter email address to monitor..."
                    className="form-cyber"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Button type="submit" className="btn-cyber" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="me-2" size={18} />
                        Add Email
                      </>
                    )}
                  </Button>
                </Form>
                <small className="text-secondary mt-2">
                  We'll automatically scan the email for breaches after adding it.
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Monitored Emails Section */}
        <Row>
          <Col>
            <Card className="glass border-cyber">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-white fw-bold mb-0">
                    <Mail className="me-2" size={20} />
                    Monitored Emails ({emails.length})
                  </h5>
                  {emails.length > 0 && (
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={refreshAllEmails}
                      disabled={loading}
                    >
                      <RefreshCw className="me-1" size={14} />
                      Refresh All
                    </Button>
                  )}
                </div>

                {emails.length === 0 ? (
                  <div className="text-center py-5">
                    <Mail className="text-secondary mb-3" size={48} />
                    <h6 className="text-light">No emails being monitored</h6>
                    <p className="text-secondary">Add an email address above to start monitoring for breaches</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table variant="dark" className="mb-0">
                      <thead>
                        <tr>
                          <th>Email Address</th>
                          <th>Status</th>
                          <th>Breaches</th>
                          <th>Security Score</th>
                          <th>Last Scanned</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emails.map((email) => (
                          <tr key={email.id || email.email}>
                            <td className="text-light">
                              <div className="d-flex align-items-center">
                                <Mail className="text-cyber-blue me-2" size={16} />
                                {email.email}
                              </div>
                            </td>
                            <td>
                              <Badge bg={email.status === 'active' ? 'success' : 'secondary'}>
                                {email.status === 'active' ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={email.breachCount > 0 ? "danger" : "success"}>
                                {email.breachCount > 0 ? `${email.breachCount} breach${email.breachCount > 1 ? 'es' : ''}` : 'No breaches'}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={
                                email.securityScore >= 80 ? 'success' :
                                email.securityScore >= 60 ? 'warning' : 'danger'
                              }>
                                {email.securityScore || 100}/100
                              </Badge>
                            </td>
                            <td className="text-light">
                              {email.lastScanned ? new Date(email.lastScanned).toLocaleDateString() : 'Never'}
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => scanEmail(email.email)}
                                  disabled={scanningEmail === email.email}
                                >
                                  {scanningEmail === email.email ? (
                                    <Spinner animation="border" size="sm" />
                                  ) : (
                                    <>
                                      <Eye className="me-1" size={14} />
                                      Scan
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => removeEmail(email.email)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Scan Result Modal */}
      <Modal show={showScanModal} onHide={() => setShowScanModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-dark text-light border-secondary">
          <Modal.Title>
            {scanResult?.breachesFound > 0 ? (
              <AlertTriangle className="text-danger me-2" />
            ) : (
              <CheckCircle className="text-success me-2" />
            )}
            Scan Results for {scanResult?.email}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          {scanResult && (
            <div>
              <div className={`text-center p-4 rounded mb-4 ${scanResult.breachesFound > 0 ? 'bg-danger bg-opacity-10' : 'bg-success bg-opacity-10'}`}>
                <h4 className={scanResult.breachesFound > 0 ? 'text-danger' : 'text-success'}>
                  {scanResult.breachesFound > 0 ? '🚨 Security Breach Detected' : '✅ No Breaches Found'}
                </h4>
                <p className="mb-0">
                  {scanResult.breachesFound > 0 
                    ? `Found ${scanResult.breachesFound} breach${scanResult.breachesFound > 1 ? 'es' : ''} affecting this email`
                    : 'Your email appears to be secure across all known breaches'
                  }
                </p>
              </div>

              {scanResult.breachesFound > 0 && (
                <div>
                  <h6 className="text-warning mb-3">Affected Services:</h6>
                  {scanResult.breaches.map((breach, index) => (
                    <Card key={index} className="bg-dark border-warning mb-2">
                      <Card.Body>
                        <h6 className="text-warning">{breach.name} - {breach.title}</h6>
                        <p className="text-light small mb-1">{breach.description}</p>
                        <div className="d-flex justify-content-between text-secondary small">
                          <span>Date: {breach.breachDate}</span>
                          <span>Severity: <Badge bg="warning">{breach.severity}</Badge></span>
                        </div>
                        <div className="mt-2">
                          <strong className="text-light">Compromised Data:</strong>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {breach.dataClasses.map((dataClass, idx) => (
                              <Badge key={idx} bg="danger" className="me-1">
                                {dataClass}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}

              <div className="mt-4 p-3 bg-secondary bg-opacity-10 rounded">
                <h6 className="text-info">Security Score: {scanResult.securityScore}/100</h6>
                <div className="progress mb-3" style={{ height: '8px' }}>
                  <div 
                    className={`progress-bar ${
                      scanResult.securityScore >= 80 ? 'bg-success' :
                      scanResult.securityScore >= 60 ? 'bg-warning' : 'bg-danger'
                    }`}
                    style={{ width: `${scanResult.securityScore}%` }}
                  ></div>
                </div>
                <small className="text-secondary">
                  Source: {scanResult.source} • Scanned: {new Date(scanResult.lastChecked).toLocaleString()}
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" onClick={() => setShowScanModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowScanModal(false)}>
            Understand
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;