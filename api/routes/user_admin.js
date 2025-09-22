const express = require('express');
const router = express.Router();
const supaConnect = require('../connected/supaConnect');

require('dotenv').config();

router.get("/list_user_admin", async (req, res) => {
    try {
        const { data, error } = await supaConnect.auth.admin.listUsers();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ users: data.users, count: data.total });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/insert_user_admin", async (req, res) => {
    try {
        
        const {
            email,
            password,
            role,
            display_name,
            forWebsites,
            nickname
        } = req.body;

        const { data, error } = await supaConnect.auth.admin.createUser({
            email,
            password,
            user_metadata: { display_name, role, forWebsites, nickname },
            email_confirm: true
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ message: 'User admin entry created', data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/update_user_admin", async (req, res) => {
    try {
        
        const {
            id,
            email,
            password,
            user_metadata
        } = req.body;

        const updateData = {
            email,
            user_metadata: {...user_metadata}
        };

        if (password) {
            updateData.password = password;
        }

        const { data, error } = await supaConnect.auth.admin.updateUserById(id, updateData);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'User admin entry updated', data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete("/delete_user_admin/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supaConnect.auth.admin.deleteUser(id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'User admin entry deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;