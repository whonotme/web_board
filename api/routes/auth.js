const express = require('express');
const router = express.Router();
const supaConnect = require('../connected/supaConnect');
require('dotenv').config();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supaConnect.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'Login successful', data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/logout", async (req,res) =>{
    try{
        const { error } = await supaConnect.auth.signOut();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).json({ message: 'Login successful' });
    }catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;