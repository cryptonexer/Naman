import React,{useEffect,useState} from 'react'
import Nav from './VoterNav'
import './Voter.css'
import { Container, Card, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Ballot from './Votingballot'

const VoterDashboard = () => {

    const [userData,setUserData] = useState([]);
    

    const Welcome = async () => {
        const req = await fetch('/api/voter/me',{
            headers:{
                'x-access-token' : localStorage.getItem('token'),
            }
        })

        const data = await req.json();
        setUserData((data.data));   
        
    }
    useEffect(() => {
        const token = localStorage.getItem('token');

        if(!token){
            window.location.href = '/VoterLogin'
        }
        else{
            Welcome();
        }
    }, [])

    const ballot = userData.ProfileStatus;
    let verification;

    if(ballot == "Verified"){
        verification = <Ballot />
    }
    else
    {
        verification = <center><h2>PROFILE UNDER VERIFICATION</h2></center>;
    }

    return (
        <div className='dashboard'>
         <div>
             <Nav/>
         </div> 
        <Container>
            <div className="dashContentbox">
                <h2>Voter's Portal</h2>
                <br />
                <div className="dashContent">
                    <p>
                        <b>Unique ID: {userData._id}</b><br />
                        <span className='warning'><i>Don't share Unique ID with anyone</i></span>
                    
                    </p>
                    <p>Voter Name: {userData.First_name} {userData.Last_name}</p>
                    <p>Email: {userData.Email}</p>
                    <p>Profile Status: {userData.ProfileStatus}</p>
                </div>
            </div>
            
        </Container>  
        <hr />

         {verification}

        </div>
    )
}

export default VoterDashboard
