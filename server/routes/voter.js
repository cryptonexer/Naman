const express = require('express');
const server = express.Router();
const Jwt = require('jsonwebtoken');
const Voter = require('../model/VoterregSchema');
const User = require('../model/PartyregSchema');
const verifyvoter = require('../middleware/verifyVoterToken');
const fs = require('fs');
const bodyparser = require('body-parser');
var md5 = require('md5');
var aes256 = require('aes256');
const key = process.env.ENCRYPTIONKEY;


//middleware
server.use(bodyparser.json());


//****************************************************************************************/
//Vote Login Route
server.post("/api/voter/register", async (req, res) => {
    const { First_name, Last_name, Phone, Email, Address, Taluka, City, Pincode, Aadhar, VoterID, Password, Cpassword } = req.body;

    if (!First_name || !Last_name || !Phone || !Email || !Address || !Taluka || !City || !Pincode || !Aadhar || !VoterID || !Password || !Cpassword) {
        return res.json({ Status: 'Please Enter all details' });
    }

    if(Phone.length!=10){
        return res.json({ Status: 'Enter valid 10-digit number'});
    }

    if (Password !== Cpassword) {
        return res.json({ Status: 'Please Enter Same Password' });
    }


    const profileStat = "NotVerified";
    const voteStat = "false";
    const pow = "none", Pid = "none";
    const hashPass = md5(req.body.Password)
    try {
        const newVoter = await Voter.create({
            First_name: First_name,
            Last_name: Last_name,
            Email: Email,
            Password: hashPass,
            ProfileStatus: profileStat,
            VoteStatus: voteStat,
            Vt: Pid,
            Pow: pow
        })

        if (newVoter) {
            res.json({ Status: 'ok' });
        }
    }
    catch (error) {
        if (error) throw error;
        res.json({ Status: 'error', error: 'Duplicate Email' });
    }

    var hashPincode = aes256.encrypt(key, Pincode);
    var hashAadhar = aes256.encrypt(key, Aadhar);
    var hashVoterID = aes256.encrypt(key, VoterID);
    var fileName = md5(First_name.concat(Last_name));


    let VoterData = {
        Name: First_name.concat(Last_name),
        Phone: Phone,
        Email: Email,
        Address: Address,
        Taluka: Taluka,
        City: City,
        Pincode: hashPincode,
        Aadhar: hashAadhar,
        Voter: hashVoterID
    }

    let data = JSON.stringify(VoterData, null, 2);
    fs.writeFileSync('./warehouse/' + fileName + '.json', data, function (err) {
        if (err) {
            console.log(err);
        }
    });
});

//-----------------------------------------------------------------------------------------

// Voter Login route
server.post('/api/voter/login', async (req, res) => {

    const hashPass = md5(req.body.Password);
    const voter = await Voter.findOne({ Email: req.body.Email, Password: hashPass });

    if (voter) {
        const token = Jwt.sign({
            First_name: voter.First_name,
            Last_name: voter.Last_name,
            Email: voter.Email

        }, process.env.SECRETKEY, {
            expiresIn: 25892000000
        });
        res.json({
            Status: 'ok', data: {
                token,
                voter: {
                    id: voter._id,
                    Email: voter.Email
                }
            }
        });
    }
    else {
        res.json({ Status: 'error', user: false });
    }
})

//-----------------------------------------------------------------------------------------

//Voter Profile route
server.get('/api/voter/me', verifyvoter, async (req, res) => {
    const rootuser = await Voter.findOne({ Email: req.Email });
    return res.json({ data: rootuser });
});

//-----------------------------------------------------------------------------------------

//Party Vote Count Increment
server.get('/voteballot/vote/:id', function (req, res) {
    const id = req.params.id;
    var i = 1;
    User.findById(id).exec((err, result) => {

        var count = result.Count;
        var newcount = count + i;


        User.findByIdAndUpdate(id, { Count: newcount }, function (err, result) {
            if (err) throw err;
            return res.send({ Status: newcount });
        })
    })
});


//creating transactions for vote
server.get('/api/voter/votertrans/:id1/:id2', async (req, res) => {

    const voteStat = "true";
    try {
        const voterid = req.params.id1;
        let voterdata = await Voter.findById(voterid).exec();

        const Partyid = req.params.id2;
        let partydata = await User.findById(Partyid).exec();

        const unique_ID = voterdata._id;
        const From = voterdata.Email;
        const party_uID = partydata._id;
        const To = partydata.Party_name;

        Voter.findByIdAndUpdate(voterid, { Vt: Partyid },
            function (err, result) {
                if (err)
                    console.log(err);
            })

        Voter.findByIdAndUpdate(voterid, { VoteStatus: voteStat },
            function (err, result) {
                if (err)
                    console.log(err);
            })

            var pow = md5(party_uID);

        Voter.findByIdAndUpdate(voterid, {Pow: pow}, function(err, result){
            if(err) throw err;
        });


        const data = {
            UnqiueId: unique_ID,
            From: From,
            Party: party_uID,
            To: To,
            POW: pow
        }

        fs.writeFile(`./transactions/${voterid}.json`, JSON.stringify(data, null, 2), (err) => {
            if (err) throw err
        })

    } catch (error) {
        if (error) throw error
    }
});

//-----------------------------------------------------------------------------------------


module.exports = server;