const express = require('express');
const router = express.Router();
const multer = require('multer');
const supaConnect = require('../connected/supaConnect');

const upload = multer();

router.post('/upload_image_comment', upload.array('files', 10), async (req, res) =>{
    try{
        const files = req.files;
        const fileNames = req.body.fileName instanceof Array ? req.body.fileName : [req.body.fileName];
        const publicUrls = [];

        for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = fileNames[i] || `comment-${Date.now()}-${i}.webp`;

        const { error } = await supaConnect.storage
            .from('comments')
            .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
            });

        if (error) return res.status(500).json({ error: error.message });

        const { data: publicData } = supaConnect.storage
            .from('comments')
            .getPublicUrl(fileName);

        publicUrls.push(publicData.publicUrl);
        }

        res.status(200).json({ publicUrls });
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
})

module.exports = router