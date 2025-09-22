const express = require('express');
const router = express.Router();
const supaConnect = require('../connected/supaConnect');

require('dotenv').config();

function stripHtmlTags(str) {
  if (!str) return "";
  return str.replace(/<\/?[^>]+(>|$)/g, ""); // ลบ tag ออก
}

router.post("/content_list", async (req, res) => {
    try {
        const { url } = req.body;
        const { data, error } = await supaConnect
            .from('content')
            .select('*')
            .eq('url_web', url)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ content: data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/:slug", async (req, res) => {
    try { 
        const slug = decodeURIComponent(req.params.slug);
        // console.log("Requested slug:", slug); // Log the requested slug
        const webData = await supaConnect
        .from('webboards')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

        const webSetting = await supaConnect
        .from('website_settings')
        .select('*')
        .eq('id', webData?.data?.web_id)
        .maybeSingle();
        
        const webboardId = webData.data.id;

        // ดึง comments เฉยๆ
        const {data: comments, error: commentError, count} = await supaConnect
            .from("comments")
            .select(`*, webboards (id, web_id, title)`, {count: "exact"})
            .eq('blog_id', webboardId)
            .order('created_at', { ascending: false });

        if (commentError) {
            return res.status(400).json({ error: commentError.message });
        }

        // ดึง user id ทั้งหมด
        const userIds = comments.map(c => c.user_id).filter(Boolean);

        // ดึงข้อมูล user จาก auth.users
        let users = [];
        if (userIds.length > 0) {
            for (const id of userIds) {
                const { data, error } = await supaConnect.auth.admin.getUserById(id);
                if (!error && data) {
                    users.push(data.user);
                }
            }
        }

        // map user เข้า comments
        const commentData = comments.map(c => ({
            ...c,
            user: users.find(u => u.id === c.user_id) || null
        }));

        // console.log(commentData); // Log the database response

        if (webData.error || webSetting.error || commentError) return res.status(404).send("Not found");

        return res.send(` 
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="keywords" content="${webData?.data?.keyword}">
                <meta name="description" content="${stripHtmlTags(webData?.data?.html_content).slice(0, 160)}">
                <meta proerty="og:title" content="${webData?.data?.title}">
                <meta proerty="og:description" content="${stripHtmlTags(webData?.data?.html_content).slice(0, 160)}">
                <meta proerty="og:image" content="${webData?.data?.banner}">
                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:title" content="${webData?.data?.title}">
                <meta name="twitter:description" content="${stripHtmlTags(webData?.data?.html_content).slice(0, 160)}">
                <meta name="twitter:image" content="${webData?.data?.banner}">
                ${webSetting?.data?.style_cdn === "bootstrap" ? 
                    `<link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                    />`
                    : 
                    `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`
                }
                <style>
                    .comment-card{
                    padding: 10px;
                    border-radius: 20px;
                    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
                    }
                </style>
                <title>${webData?.data?.title}</title>
                
            </head>
            <body style="overflow-x: hidden; overflow-y: auto;">
                <div>
                    ${webSetting ? 
                        `${webSetting?.data?.header_html}`
                    : 
                        `<nav style="background-color: #ffffff; padding: 20px; text-align: left; margin-bottom: 20px;">
                            <a style="text-decoration: none; color: black; font-size: 20px;" href="/">Home</a>
                        </nav>`
                    }
                    <div style="max-width: 1000px; height: 350px; margin-left: auto; margin-right: auto; margin-top: 20px">
                        <img 
                        src="${webData?.data?.banner}" 
                        alt="${webData?.data?.slug}" 
                        style="width: 100%; 
                        height: 100%; 
                        border-radius: 8px; 
                        object-fit: cover;"
                        />
                    </div>
                    
                    <div style="position: relative; display: inline-block; text-align: center; color: white; margin-top: 50px; width: 100%; color: black;" >
                        <h1 style="margin: 0;">${webData?.data?.title}</h1>
                        <div style="margin-top: 20px; max-width: 800px; margin-left: auto; margin-right: auto; text-align: left; font-size: 18px; line-height: 1.6;">
                        ${webData?.data?.html_content}
                        </div>
                    </div>
                    ${commentData?.map((item, index) =>{
                        return(
                            `<div key="${index}" class="comment-card" style="max-width: 50%; margin-left: auto; margin-right: auto; ">
                                <div style="display: flex;">
                                    <img 
                                    alt="" 
                                    src="https://avirsaodsgyjfohwaydy.supabase.co/storage/v1/object/public/assets/blank-profile-picture-973460_1280.png" 
                                    style="width: 50px; height: 50px; border-radius: 50%; margin-right: 20px;"
                                    />
                                    <div style="min-height: 100px; width: 100%; word-break: break-all; margin-bottom: 10px;">
                                    <span><strong style="margin-right: 10px;">${item?.user?.user_metadata?.nickname}</strong> ${new Date(item?.created_at).toLocaleString('th-TH', {day:'2-digit', month:'2-digit', year:'2-digit'})}</span>
                                    ${item?.comment}
                                    </div>
                                    
                                </div>
                                ${item?.reply?.map((reItem, i) =>{
                                    return(
                                        `<div key="${i}" style="padding-left: 20%; display: flex; margin-bottom: 20px">
                                            <img 
                                            alt="img" 
                                            src="https://avirsaodsgyjfohwaydy.supabase.co/storage/v1/object/public/assets/blank-profile-picture-973460_1280.png" 
                                            style="width: 50px; height: 50px; border-radius: 50%; margin-right: 20px;"
                                            />
                                            <div style="width: 100%; word-break: break-all; margin-bottom: 10px;">
                                            <span><strong style="margin-right: 10px;">${reItem?.name}</strong> ${new Date(reItem?.created_at).toLocaleString('th-TH', {day:'2-digit', month:'2-digit', year:'2-digit'})}</span>
                                            <p>${reItem?.text}</p>
                                            </div>
                                        </div>`
                                    )
                                }).join('')}
                                
                            </div>`
                        )
                    })}
                    ${webSetting ? 
                        `${webSetting?.data?.footer_html}`
                    : null}
                </div>
            </body>
            ${webSetting?.data?.style_cdn === "bootstarp" ? 
                `https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js`    
            : ""}
        </html>`);

    } catch (error) {
        console.log(error)
        return res.status(500).send("Server error");
    }
});

module.exports = router;