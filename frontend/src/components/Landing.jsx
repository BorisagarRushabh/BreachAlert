import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Bell, Lock, Zap, ArrowRight, Sparkles, Globe } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Bell,
      title: "Real-time Alerts",
      description: "Get instant notifications when your data appears in new breaches.",
    },
    {
      icon: Shield,
      title: "Continuous Monitoring", 
      description: "24/7 surveillance across all known data breaches and dark web sources.",
    },
    {
      icon: Lock,
      title: "Security Guidance",
      description: "Actionable steps to secure your accounts after a breach detection.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Advanced AI-powered scanning delivers results in seconds.",
    }
  ];

  return (
    <div className="bg-dark-custom min-vh-100">
      {/* Navigation */}
      <nav className="navbar-cyber">
        <Container>
          <div className="d-flex justify-content-between align-items-center py-3">
            <div className="d-flex align-items-center">
              <div className="bg-cyber-gradient rounded-circle p-2 me-3">
                <Shield className="text-white" size={24} />
              </div>
              <span className="gradient-text h3 mb-0 fw-bold">BreachAlert</span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Link to="/login" className="text-light text-decoration-none">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-cyber">
                Get Started
              </Link>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center py-5">
            <Col lg={8} className="mx-auto">
              {/* Status Badge */}
              <div className="badge-cyber mb-4">
                <Sparkles size={16} />
                PROTECTING 50,000+ USERS WORLDWIDE
              </div>

              <h1 className="display-4 fw-bold text-white mb-4">
                Your Digital Armor
                <br />
                <span className="gradient-text">Against Data Breaches</span>
              </h1>
              
              <p className="lead text-light mb-5">
                Advanced AI-powered monitoring that detects compromised accounts before they become threats. 
                Join thousands of protected users worldwide.
              </p>

              <div className="d-flex flex-column flex-md-row gap-3 justify-content-center align-items-center">
                <Link to="/register" className="btn btn-cyber btn-lg px-4">
                  <Shield className="me-2" size={20} />
                  Start Free Protection
                  <ArrowRight className="ms-2" size={18} />
                </Link>
                
                <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                  View Dashboard
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-5 pt-4">
                <p className="text-light mb-3">Trusted by security teams worldwide</p>
                <div className="d-flex justify-content-center gap-4 text-cyber-cyan">
                  <span>TechCorp</span>
                  <span>SecureBank</span>
                  <span>DataGuard</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-darker">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold text-white mb-3">
                Enterprise-Grade <span className="gradient-text">Protection</span>
              </h2>
              <p className="text-light">
                Advanced features designed to keep your digital identity secure
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={6} key={index}>
                <Card className="glass border-cyber h-100">
                  <Card.Body className="p-4 text-center">
                    <div className="bg-cyber-blue rounded-circle p-3 mb-3 d-inline-flex">
                      <feature.icon className="text-white" size={24} />
                    </div>
                    <Card.Title className="text-white h5">{feature.title}</Card.Title>
                    <Card.Text className="text-light">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Landing;