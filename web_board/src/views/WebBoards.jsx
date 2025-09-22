import React from 'react';
import { 
    GoPlusCircle,
    GoTrash,
    GoPencil,
    GoEye
} from "react-icons/go";
import DataTable from './components/DataTable';
import SlideModal from './components/Modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function WebBoards(){
    const [fetchData, setFetchData] = React.useState([]);
    const [adminData, setAdminData] = React.useState(null);
    const [websettingList, setWebsettingList] = React.useState([]);
    const navigate = useNavigate();
    

    React.useEffect(() => {
        const auth = sessionStorage.getItem('auth')
        const parseAuth = JSON.parse(auth)
        // console.log(parseAuth)
        if(!auth){
            navigate('/')
        }
        setAdminData(parseAuth)
        async function fetchWebBoards() {
            try {
                const response = await axios.post(API_URL+'/webboard/list_webboard',{
                    url_web: parseAuth?.user_metadata?.forWebsites
                });
                if (response.status === 200) {
                    // console.log('Webboard data:', response.data);
                    setFetchData(response.data);
                } else {
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchWebBoards();
    }, []);

    

    const [openModal, setOpenModal] = React.useState(false);
    const editorRef = React.useRef(null);
    const [inSertData, setInsertData] = React.useState({
        title: '',
        web_id: '',
        slug: '',
        html_content: '',
        banner: '',
        keyword: '',
        // user_id: "9095b85b-2a19-4543-bfd5-0dbea39e8251",
    });

    async function onGetWebboardList(){
        try{
            const result = await axios.post(API_URL+'/webboard/list_websetting',{
                url_web: adminData?.user_metadata?.forWebsites
            })
            if(result.status === 200){
                // console.log(result.data)
                setInsertData({...inSertData, web_id: result?.data?.website_settings[0]?.id})
                setWebsettingList(result.data.website_settings)
            }
        }catch(err){
            console.log(e)
        }
    }
    
    function onOpenNewWebboard(){
        setOpenModal(true)
        onGetWebboardList()
    }

    function onCloseNewWebboard(){
        setOpenModal(false);
        setInsertData({
            title: '',
            web_id: '',
            slug: '',
            html_content: '',
            banner: '',
            keyword: '',
        })
        window.$(editorRef.current).summernote('code', '');
    }

    React.useEffect(() => {
        // Initialize Summernote
        if (openModal) {
            if (window.$ && editorRef.current) {
                window.$(editorRef.current).summernote({
                    placeholder: "Type something...",
                    height: 300,
                    tabsize: 2,
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'underline', 'clear']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture', 'video']],
                        ['view', ['fullscreen', 'codeview', 'help']]
                    ]
                });
                window.$(editorRef.current).summernote('code', inSertData?.html_content || '');
            }
            
            // 
        }
        // Cleanup Summernote on modal close
        return () => {
            if ($(editorRef.current).data('summernote')) {
                $(editorRef.current).summernote('destroy');
            }
        };
    }, [openModal]);

    function onSlugChange(e) {
        const slug = inSertData?.title?.trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-ก-๙]/g, '')
        .replace(/\-+/g, '-');;
        setInsertData({...inSertData, slug});
    }

    async function onInsertSubmit(e) {
        try{
            e.preventDefault();
            const htmlContent = window.$(editorRef.current).summernote('code');
            const payload = {
                ...inSertData,
                user_id: adminData?.id,
                html_content: htmlContent
            };
            const response = await axios.post(API_URL+'/webboard/insert_webboard', {
                ...payload,
            });
            if (response.status === 201) {
                alert('Web Board added successfully!');
                setOpenModal(false);
                // Reset form
                setInsertData({
                    title: '',
                    web_id: '',
                    slug: '',
                    html_content: '',
                    banner: '',
                    keyword: '',
                    // user_id: "9095b85b-2a19-4543-bfd5-0dbea39e8251",
                });
                window.$(editorRef.current).summernote('code', '');
            } else {
                alert('Error adding Web Board: ' + result.error);
            }
        }catch(err){
            console.log(err)
        }
    }

    const [editData, setEditData] = React.useState(null);
    const [editToggle, setEditToggle] = React.useState(false);
    const editorRef2 = React.useRef(null);

    React.useEffect(() => {
        if (window.$ && editorRef2.current && editData?.html_content !== undefined) {
            window.$(editorRef2.current).summernote('code', editData.html_content);
        }
    }, [editData]);

    function onEditOpen(params) {
        
        setEditToggle(true);
        setEditData(params);
        onGetWebboardList()
    }

    function onEditClose() {
        setEditToggle(false);
        setEditData(null);
        $('#summernote').data('summernote')
        $('#summernote').summernote('destroy')
    }

    function onSlugEditChange() {
        const slug = editData?.title?.trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-ก-๙]/g, '')
        .replace(/\-+/g, '-');;
        setEditData({...editData, slug});
    }

    async function onEditSubmit(e) {
        e.preventDefault();
        try{
            const htmlContent = window.$(editorRef2.current).summernote('code');
            const payload = {
                ...editData,
                html_content: htmlContent
            };
            console.log('Edit Data to submit:', payload);
            const response = await axios.post(API_URL+'/webboard/update_webboard', {
                ...payload,
            });
            if (response.status === 201) {
                alert('Web Board added successfully!');
                setOpenModal(false);
                // Reset form
                setInsertData({
                    title: '',
                    url_web: '',
                    slug: '',
                    html_content: '',
                    banner: '',
                    keyword: '',
                    // user_id: "9095b85b-2a19-4543-bfd5-0dbea39e8251",
                });
                window.$(editorRef.current).summernote('code', '');
            } else {
                alert('Error adding Web Board: ' + result.error);
            }
        }catch(err){
            console.log(err)
        }
        const htmlContent = window.$(editorRef2.current).summernote('code');
        
        setEditData({...editData, html_content: htmlContent});
        console.log('Edit Data to submit:', {...editData, html_content: htmlContent});
    }

    function onViewer(slug){
        window.open(API_URL+'/content/'+slug)
        // navigate(API_URL+'/content/'+slug)
    }

    return(
        <>
        <div className='webboard-container'>
            <h4 className='mb-15'>Web Boards</h4>
            <p>This is the Web Boards page.</p>
            {/* Add more content as needed */}
            <DataTable 
            columns={[
                { header: "ID", accessor: "id", cell: (row) => <span className="id">{row.id}</span> },
                { header: "Banner", accessor: "banner", cell: (row) => <img alt='' src={row.banner || null} style={{width:'100px', height:'50px', objectFit:'contain'}} /> },
                { header: "Title", accessor: "title" },
                { header: "URL", accessor: "url_web", cell:(row) => row?.website_settings?.url_web },
                { header: "Slug", accessor: "slug" },
                { header: "Key Word", accessor: "keyword" },
                { header: "Created At", accessor: "created_at", cell: (row) => new Date(row.created_at).toLocaleDateString('th-TH',{day:'2-digit', month:'short', year:'2-digit'}) },
                { header: "Updated At", accessor: "updated_at", cell: (row) => row.updated_at ? new Date(row.updated_at).toLocaleDateString('th-TH',{day:'2-digit', month:'short', year:'2-digit'}) : "" },
                { header: "", accessor: "action", cell: (row) => (
                    <div className='flex'>
                        <button className="btn btn-sm btn-secondary mr-10" onClick={() => onEditOpen(row)}>
                            <GoPencil/>
                        </button>
                        <button className="btn btn-sm btn-danger mr-10">
                            <GoTrash/>
                        </button>
                        <button className="btn btn-sm btn-warning" onClick={() => onViewer(row.slug)}>
                            <GoEye/>
                        </button>
                    </div>
                )}
            ]}
            data={fetchData?.webboards || []}
            title="All Web Boards"
            count={fetchData?.count || 0}
            actionButton={
                <>
                <button className='btn btn-primary mr-10' onClick={() => onOpenNewWebboard()}>
                    <GoPlusCircle className='mr-10'/> Add New
                </button>
                </>
            }
            />
        </div>

        {/* add webboard */}
        <SlideModal 
        isOpen={openModal} 
        onClose={() => onCloseNewWebboard()} 
        title="Add New Web Board"
        >
            <form onSubmit={onInsertSubmit}>
                <div className='row'>
                    <div className='col-12'>
                        <div className='form-group'>
                            <label>Title:</label>
                            <input 
                            type="text" 
                            className='form-control' 
                            placeholder='Enter title' 
                            value={inSertData?.title}
                            onChange={(e) => setInsertData({...inSertData, title: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12 col-md-6'>
                        <div className='form-group'>
                            <label>For Web:</label>
                            <select 
                            className='form-control'
                            name="blog_id"
                            value={inSertData?.web_id}
                            disabled = {adminData?.user_metadata?.role === "admin" ? true : false}
                            onChange={(e) => setInsertData({...inSertData, web_id: e.target.value})}
                            >
                                <option key={0} value={""}>เลือก</option>
                                {websettingList?.map((item, i) =>{
                                    return(
                                        <option key={i+1} value={item?.id}>{item?.url_web}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className='col-12 col-md-6'>
                        <div className='form-group'>
                            <label>Slug:</label>
                            <input 
                            type="text" 
                            className='form-control' 
                            placeholder='Enter slug' 
                            value={inSertData?.slug}
                            onChange={(e) => setInsertData({...inSertData, slug: e.target.value})}
                            onFocus={onSlugChange}
                            />
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label>Banner URL:</label>
                    <input 
                    type="text" 
                    className='form-control' 
                    placeholder='Enter banner URL' 
                    value={inSertData?.banner}
                    onChange={(e) => setInsertData({...inSertData, banner: e.target.value})}
                    />
                </div>
                <div>
                    <img alt='' src={inSertData?.banner || null} style={{width:'100%', height:'200px', objectFit:'contain'}} />
                </div>
                <div className='form-group'>
                    <label>Key Word: <small className='color-red'>กรุณาใส่ ( , ) หากมีหลาย Key</small></label>
                    <input 
                    type="text" 
                    className='form-control' 
                    placeholder='eq. xxxxx,xxxx,xxxx' 
                    value={inSertData?.keyword}
                    onChange={(e) => setInsertData({...inSertData, keyword: e.target.value})}
                    />
                </div>

                <div className='form-group'>
                    <label>HTML Content:</label>
                    <div ref={editorRef}></div>
                </div>
                <div className='form-actions'>
                    <button type="submit" className='btn btn-primary'>Save</button>
                    <button type="button" className='btn btn-secondary' onClick={() => onCloseNewWebboard()}>Cancel</button>
                </div>
            </form>
        </SlideModal>

        {/* edit webboard */}
        <SlideModal 
        isOpen={editToggle} 
        onClose={() => onEditClose()} 
        title={`Edit Web Board - ${editData?.title}`}
        >
            <form onSubmit={(e) => { onEditSubmit(e) }}>
                <div className='row'>
                    <div className='col-12'>
                        <div className='form-group'>
                            <label>Title:</label>
                            <input 
                            type="text" 
                            className='form-control' 
                            placeholder='Enter title' 
                            value={editData?.title}
                            onChange={(e) => setEditData({...editData, title: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12 col-md-6'>
                        <div className='form-group'>
                            <label>URL:</label>
                            <select 
                            className='form-control'
                            name="blog_id"
                            value={editData?.web_id}
                            disabled
                            onChange={(e) => setInsertData({...editData, web_id: e.target.value})}
                            >
                                <option key={0} value={""}>เลือก</option>
                                {websettingList?.map((item, i) =>{
                                    return(
                                        <option key={i+1} value={item?.id}>{item?.url_web}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className='col-12 col-md-6'>
                        <div className='form-group'>
                            <label>Slug:</label>
                            <input 
                            type="text" 
                            className='form-control' 
                            placeholder='Enter slug' 
                            value={editData?.slug}
                            onChange={(e) => setEditData({...editData, slug: e.target.value})}
                            onFocus={onSlugEditChange}
                            />
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label>Banner URL:</label>
                    <input 
                    type="text" 
                    className='form-control' 
                    placeholder='Enter banner URL' 
                    value={editData?.banner}
                    onChange={(e) => setEditData({...editData, banner: e.target.value})}
                    />
                </div>
                <div>
                    <img alt='' src={editData?.banner || null} style={{width:'100%', height:'200px', objectFit:'contain'}} />
                </div>
                <div className='form-group'>
                    <label>Key Word: <small className='color-red'>กรุณาใส่ ( , ) หากมีหลาย Key</small></label>
                    <input 
                    type="text" 
                    className='form-control' 
                    placeholder='Exp xxxxx,xxxx,xxxx' 
                    value={editData?.keyword}
                    onChange={(e) => setEditData({...editData, keyword: e.target.value})}
                    />
                </div>

                <div className='form-group'>
                    <label>HTML Content:</label>
                    <div ref={editorRef2}></div>
                </div>
                <div className='form-actions'>
                    <button type="submit" className='btn btn-primary'>Save</button>
                    <button type="button" className='btn btn-secondary' onClick={() => onEditClose()}>Cancel</button>
                </div>
            </form>
        </SlideModal>
        </>
    )
}
export default WebBoards