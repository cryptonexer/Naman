const express = require('express');
const router = express.Router();
const Jwt = require('jsonwebtoken');
const Voter = require('../model/VoterregSchema');
const verifyvoter = require('../middleware/verifyVoterToken');
const fs = require('fs');
const bodyparser = require('body-parser');

router.use(bodyparser.json());


//Vote Login Route
router.post("/api/voter/register", async (req, res) => {
    const { First_name, Last_name, Phone, Email, Address, Taluka, City, Pincode, Aadhar, VoterID, Password, Cpassword } = req.body;

  if (!First_name || !Last_name || !Phone || !Email || !Address || !Taluka || !City || !Pincode || !Aadhar || !VoterID || !Password || !Cpassword) {
    return res.json({ Status: 'Please Enter all details' });
  }

  if (Password !== Cpassword) {
    return res.json({ Status: 'Please Enter Same Password' });
  }

  const profileStat = "NotVerified";
  const voteStat = "false";

  try {
    const newVoter = await Voter.create({
      First_name: First_name,
      Last_name: Last_name,
      Email: Email,
      Password: Password,
      ProfileStatus: profileStat,
      VoteStatus: voteStat
    })

    if (newVoter) {
      res.json({ Status: 'ok' });
    }
  }
  catch (error) {
    if (error) throw error;
    res.json({ Status: 'error', error: 'Duplicate Email' });
  }


  let VoterData = {
    Name: First_name.concat(Last_name),
    Phone: Phone,
    Email: Email,
    Address: Address,
    Taluka: Taluka,
    City: City,
    Pincode: Pincode,
    Aadhar: Aadhar,
    Voter: VoterID
  }

  let data = JSON.stringify(VoterData, null, 2);
  fs.writeFileSync('./warehouse/' + First_name + '.json', data, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("Inserted");
  });
});

// Voter Login route
router.post('/api/voter/login', async (req, res) => {
    const voter = await Voter.findOne({ Email: req.body.Email, Password: req.body.Password });


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
});


//Voter Profile route
router.get('/api/voter/me', verifyvoter, async (req, res) => {
    const rootuser = await Voter.findOne({ Email: req.Email });
    return res.json({ data: rootuser });
});


//Vote Count 
router.get('/voteballot/vote/:id', function (req, res) {
    const id = req.params.id;
    var i = 1;
    User.findById(id).exec((err, result) => {

        var count = result.Count;
        var newcount = count + i;

        User.findByIdAndUpdate(id, { Count: newcount }, function (err, result) {
            if (err) throw err;
            return res.send({ Status: newcount });
        })
    });
});


//changing vote status to true
router.put('/api/voter/votestat/:id', async (req, res) => {
    const id = req.params.id;
    const voteStat = "true";

    Voter.findByIdAndUpdate(id, { VoteStatus: voteStat }, function (err, result) {
        if (err) throw err;
        return res.send({ votestatus: voteStat })
    })
})


//creating transactions for vote
router.get('/api/voter/votertrans/:id1/:id2', async (req, res) => {
    try {
        const voterid = req.params.id1;
        let voterdata = await Voter.findById(voterid).exec();

        const Partyid = req.params.id2;
        let partydata = await User.findById(Partyid).exec();

        const unique_ID = voterdata._id;
        const From = voterdata.Email;
        const To = partydata.Email;

        const data = {
            unique_ID,
            From,
            To
        }

        fs.writeFile(`./transactions/${voterid}.json`, JSON.stringify(data), (err) => {
            if (err) throw err
        })

    } catch (error) {
        if (error) throw error
    }

});

module.exports = router;
