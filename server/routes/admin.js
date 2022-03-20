const express = require('express');
const router = express();
const User = require('../model/PartyregSchema');
const Admin = require('../model/Adminschema');
const Voter = require('../model/VoterregSchema')



//Admin login route 
router.post('/api/adlogin', async (req, res) => {
    const user = await Admin.findOne({ Email: req.body.Email, Password: req.body.Password })

    if (user) {
        res.json({ Status: 'ok' })
    }
    else {
        res.json({ Status: 'error', user: false });
    }
});


//admin Userdetails route
router.get('/api/party/details', (req, res) => {
    User.find({}).exec((err, result) => {
        if (err) throw err;
        res.send({ data: result });
    })
})


//admin Userdetails route for active users
router.get('/api/activeUsers', (req, res) => {
    const Stat = 'Active';

    User.find({ Status: Stat }).exec((err, result1) => {
        if (err) throw err;
        res.send({ data1: result1 });
    })
});


//admin Userdetails route for Inactive users
router.get('/api/deactiveUsers', (req, res) => {
    const Stat = 'Inactive';

    User.find({ Status: Stat }).exec((err, result2) => {
        if (err) throw err;
        res.send({ data2: result2 });
    })
});


//User Control Route: Activate
router.put('/api/activate', async (req, res) => {
    const id = req.body.id;
    const Stat = "Active";
    const update = await User.findByIdAndUpdate(id, { Status: Stat });

    if (update) {
        res.send({ status: update });
    }
    else {
        res.send({ error: 'Not Updated' });
    }
});


//User Control Route: Deactivate
router.put('/api/deactivate', async (req, res) => {
    const id = req.body.id;
    const Stat = "Inactive";
    const update = await User.findByIdAndUpdate(id, { Status: Stat });

    if (update) {
        res.send({ status: update });
    }
    else {
        res.send({ error: 'Not Updated' });
    }
});


//delete users
router.delete('/api/delete/:id', async (req, res) => {
    const id = req.params.id;
    const remove = await User.findByIdAndRemove(id).exec();

    res.send(remove);
})
//===================================================================

//ADMIN CONTROL FOR VOTERS
router.get('/api/Voter/details', (req, res) => {
    Voter.find({}).exec((err, result) => {
        if (err) throw err;
        res.send({ data: result });
    })
})

router.get('/api/activeVoters', (req, res) => {
    const Stat = 'Verified';

    Voter.find({ ProfileStatus: Stat }).exec((err, result1) => {
        if (err) throw err;
        res.send({ data1: result1 });
    })
});

router.get('/api/deactiveVoters', (req, res) => {
    const Stat = 'NotVerified';

    Voter.find({ ProfileStatus: Stat }).exec((err, result2) => {
        if (err) throw err;
        res.send({ data2: result2 });
    })
});

router.put('/api/Voter/verify', async (req, res) => {
    const id = req.body.id;
    const Stat = "Verified";
    const update = await Voter.findByIdAndUpdate(id, { ProfileStatus: Stat });

    if (update) {
        res.send({ status: update });
    }
    else {
        res.send({ error: 'Not Updated' });
    }
});

router.put('/api/Voter/decline', async (req, res) => {
    const id = req.body.id;
    const Stat = "NotVerified";
    const update = await Voter.findByIdAndUpdate(id, { ProfileStatus: Stat });

    if (update) {
        res.send({ status: update });
    }
    else {
        res.send({ error: 'Not Updated' });
    }
});



module.exports = router;
