import { useEffect, useState } from 'react';
import {Container, Row, Col} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './indexStyle.css'
import voter from './undraw_voting_nvu7.svg'
import candidate from './undraw_candidate_ubwv.svg'
import Anime from './Splash/Animation'
import Particles from "react-tsparticles";

function Index() {
    const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 6000)
  },[])
  const particlesInit = (main) => {
    };

    const particlesLoaded = (container) => {
    };
  return (
    <div>
        {loading ? ( <Anime /> ): (
            <>
            <div className="particle">
                <Particles 
                    id="tsparticles"
                    init={particlesInit}
                    loaded={particlesLoaded}
                    options={{
                        
                        fpsLimit: 60,
                        interactivity: {
                        events: {
                            onClick: {
                            enable: false,
                            mode: "push",
                            },
                            onHover: {
                            enable: false,
                            },
                            resize: true,
                        },
                        modes: {
                            bubble: {
                            distance: 800,
                            duration: 2,
                            opacity: 0.8,
                            size: 20,
                            },
                            push: {
                            quantity: 4,
                            },
                            repulse: {
                            distance: 200,
                            duration: 0.4,
                            },
                        },
                        },
                        particles: {
                        color: {
                            value: "#ffffff",
                        },
                        links: {
                            color: "#ffffff",
                            distance: 150,
                            enable: true,
                            opacity: 0.5,
                            width: 1,
                        },
                        collisions: {
                            enable: true,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outMode: "bounce",
                            random: false,
                            speed: 2,
                            straight: false,
                        },
                        number: {
                            density: {
                            enable: true,
                            area: 500,
                            },
                            value: 30,
                        },
                        opacity: {
                            value: 0.5,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            random: true,
                            value: 5,
                        },
                        },
                        detectRetina: false,
                    }}
                />

            </div>
            <div className="landing">
            <Container>
                <div className="logo">
                    <p>BLOCKCHAIN<span>.</span></p>  
                </div>
            
                <div className="intro">
                    <p className="greet">Hello!!!</p>
                    <p className="brand">Cryptonex</p>
                    <p className="tag">Blockchain based Tech</p>
                    <hr />
                    <h5 className='desc'>Project-Title: Electronic Voting System based on Blockchain</h5>
                    
                    <p>Abstract: Building a secure electronic voting system that offers the fairness and privacy of current voting schemes, while providing the transparency and flexibility offered by electronic systems has been a challenge for a long time. We evaluate an application of blockchain as a service to implement distributed electronic voting systems. This website proposes a novel electronic voting system based on blockchain that addresses some of the limitations in existing systems and evaluates some of the popular blockchain frameworks for the purpose of constructing a blockchain-based e-voting system. </p>
                </div>
            </Container>
        </div>

        <div className="portal">
            <Container>
                <h4>Portal</h4>
                    <a href="/results" id="results">view Result</a>
                <Row>
                    <Col md={6}>
                        <div className="card">
                            <div className="imgBox">
                                <img src={voter} alt="" />
                            </div>
                            <div className="contentBox">
                                <h3>Voter's Portal</h3>
                                <hr />
                                <LinkContainer to="/VoterLogin">
                                    <button>Login</button>
                                </LinkContainer>
                                <LinkContainer to="/VoterReg">
                                    <button>Register</button>
                                </LinkContainer>
                                
                            </div>

                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="card">
                            <div className="imgBox">
                                <img src={candidate} alt="" className='candid'/>
                            </div>
                            <div className="contentBox">
                                <h3>Party's Portal</h3>
                                <hr />
                                <LinkContainer to="/partylogin">
                                    <button>Login</button>
                                </LinkContainer>
                                <LinkContainer to="/partyreg">
                                    <button>Register</button>
                                </LinkContainer>
                            </div>

                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
            </>
        )}
        
    </div>
  )
}

export default Index