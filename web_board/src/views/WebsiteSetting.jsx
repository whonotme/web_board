import React from "react";
import DataTable from "./components/DataTable";
import { 
    GoPlusCircle,
    GoTrash,
    GoPencil
} from "react-icons/go";
import SlideModal from './components/Modal';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

function WebsiteSetting(){
    const navigate = useNavigate();
    const [webList, setWebList] = React.useState([]);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        async function fetchData(){
            try {
                const response = await axios.get(API_URL+'/website_setting/list_website_setting');
                if (response.status === 200) {
                    setWebList(response.data.website_settings);
                    setCount(response.data.count);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const [isAddOpen, setIsAddOpen] = React.useState(false);
    const HeaderRef = React.useRef(null);
    const FooterRef = React.useRef(null);
    const [addData, setAddData] = React.useState({
        url_web: '',
        Header_html: '',
        Footer_html: '',
        style_cdn:  '',
    });

    function onSummernoteLoad(ref, data) {
        if (window.$ && ref.current) {
            window.$(ref.current).summernote({
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
            window.$('#summernote').summernote('code', data || '');
        }
    }

    React.useEffect(() => {
        // Initialize Summernote
        if (isAddOpen) {
            onSummernoteLoad(HeaderRef, addData.Header_html);
            onSummernoteLoad(FooterRef, addData.Footer_html);
        }

        // Cleanup Summernote on modal close
        return () => {
            if ($('#summernote').data('summernote')) {
                $('#summernote').summernote('destroy');
            }
        };
    }, [isAddOpen]);

    function onAddClose(){
        setAddData({
            Web_URL: '',
            Header_html: '',
            Footer_html: '',
            style_cdn:  '',
        });
        setIsAddOpen(false)
    }

    async function onAddSubmit(e){
        e.preventDefault();
        try {
            const headerHTML = window.$(HeaderRef.current).summernote('code');
            const footerHTML = window.$(FooterRef.current).summernote('code');
            // console.log('Header HTML:', headerHTML);
            // console.log('Footer HTML:', footerHTML);
            // You can now use headerHTML and footerHTML as needed, e.g., send to server
            // setAddData({
            //     ...addData,
            //     Header_html: headerHTML,
            //     Footer_html: footerHTML,
            // });
            // Example: Sending data to server
            const response = await axios.post(API_URL+'/website_setting/insert_website_setting', {
                ...addData,
                header_html: headerHTML,
                footer_html: footerHTML,
            });

            if (response.status === 200) {
                setIsAddOpen(false);
                // Reset form or show success message as needed
                setAddData({
                    Web_URL: '',
                    Header_html: '',
                    Footer_html: '',
                    style_cdn:  '',
                });
                alert('Website setting added successfully!');
                navigate(0); // Refresh the page
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    const [editData, setEditData] = React.useState({
        id: null,
        Web_URL: '',
        Header_html: '',
        Footer_html: '',
        style_cdn:  '',
    });
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const editHeaderRef = React.useRef(null);
    const editFooterRef = React.useRef(null);

    React.useEffect(() => {
        if (window.$ && editHeaderRef.current && editData?.Header_html !== undefined) {
            window.$(editHeaderRef.current).summernote({
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
            window.$(editHeaderRef.current).summernote('code', editData.Header_html);
        }
        if (window.$ && editFooterRef.current && editData?.Footer_html !== undefined) {
            window.$(editFooterRef.current).summernote({
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
            window.$(editFooterRef.current).summernote('code', editData.Footer_html);
        }
    }, [editData]);

    function onEditClose(){
        setIsEditOpen(false);
        setEditData({
            id: null,
            url_web: '',
            Header_html: '',
            Footer_html: '',
            style_cdn:  '',
        });
        // Cleanup Summernote instances
        if (window.$) {
            if (window.$(editHeaderRef.current).data('summernote')) {
                window.$(editHeaderRef.current).summernote('destroy');
            }
            if (window.$(editFooterRef.current).data('summernote')) {
                window.$(editFooterRef.current).summernote('destroy');
            }
        }
    }

    async function onEditSubmit(e){
        e.preventDefault();
        try{
            const htmlHeader = window.$(editHeaderRef.current).summernote('code');
            const htmlFooter = window.$(editFooterRef.current).summernote('code');
            const payload = {
                ...editData,
                header_html: htmlHeader,
                footer_html: htmlFooter,
            };
            const response = await axios.post(API_URL+'/website_setting/update_website_setting', {
                ...payload,
            });
            if (response.status === 200) {
                alert('Website setting updated successfully!');
                setIsEditOpen(false);
                navigate(0); // Refresh the page
            }
        }catch(error){
            console.error('Error submitting form:', error);
        }
    }

    return(
        <>
        <div className='websitesetting-container'>
            <h4 className='mb-15'>Website Setting</h4>
            <p>This is the Website Setting page.</p>
            {/* Add more content as needed */}
            <DataTable
            columns={[
                { header: 'ID', accessor: 'id' },
                { header: 'Web_URL', accessor: 'url_web' },
                { header: 'Create', accessor: 'created_at', cell: (row) => new Date(row.created_at).toLocaleDateString("th-TH",{day:'2-digit', month:'short', year:'2-digit'})},
                { header: 'Action', accessor: 'action', cell: (row) => (
                    <div className="action-buttons" style={{ display: 'flex', gap: '5px' }}>
                        <button 
                        className="btn btn-sm btn-primary mr-5" 
                        onClick={() => {
                            setEditData({
                                id: row.id,
                                url_web: row.url_web,
                                Header_html: row.header_html,
                                Footer_html: row.footer_html,
                                style_cdn: row.style_cdn,
                            });
                            setIsEditOpen(true);
                        }}
                        >
                            <GoPencil />
                        </button>
                        <button 
                        className="btn btn-sm btn-danger" 
                        onClick={async () => {
                            if (confirm('Are you sure you want to delete this website setting?')) {
                                try {
                                    const response = await axios.delete(`${API_URL}/website_setting/delete_website_setting/${row.id}`);
                                    if (response.status === 200) {
                                        alert('Website setting deleted successfully!');
                                        navigate(0); // Refresh the page
                                    }
                                } catch (error) {
                                    console.error('Error deleting website setting:', error);
                                }
                            }
                        }}
                        >
                            <GoTrash />
                        </button>
                    </div>
                )},
            ]}
            data={webList}
            title="Website List"
            count={count}
            actionButton={
                <>
                <button className='btn btn-primary mr-10' onClick={() => setIsAddOpen(true)}>
                    <GoPlusCircle className='mr-10'/> Add New
                </button>
                </>
            }
            />
        </div>

        {/* Add Modal */}
        <SlideModal
        isOpen={isAddOpen}
        onClose={() => onAddClose()}
        title="Add New Setting"
        >
            <div className='p-15'>
                <form onSubmit={onAddSubmit}>
                    <div className="form-group mb-15">
                        <label>Website URL</label>
                        <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter website URL" 
                        value={addData.url_web}
                        onChange={(e) => setAddData({...addData, url_web: e.target.value})}
                        />
                    </div>
                    <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input 
                        type="radio" 
                        className="btn-check" 
                        name="btnradio" 
                        id="btnradiobootstrap" 
                        autoComplete="off" 
                        checked={addData.style_cdn === 'bootstrap'}
                        onChange={() => setAddData({...addData, style_cdn: 'bootstrap'})} 
                        />
                        <label className="btn btn-outline-primary" htmlFor="btnradiobootstrap">bootstrap</label>

                        <input 
                        type="radio" 
                        className="btn-check" 
                        name="btnradio" 
                        id="btnradioTailwind" 
                        autoComplete="off" 
                        checked={addData.style_cdn === 'tailwind'}
                        onChange={() => setAddData({...addData, style_cdn: 'tailwind'})}
                        />
                        <label className="btn btn-outline-primary" htmlFor="btnradioTailwind">Tailwind</label>
                    </div>
                    <div className="mb-15">
                        <label>Header HTML</label>
                        <div ref={HeaderRef} id="summernote"/>
                    </div>
                    <div className="mb-15">
                        <label>Footer HTML</label>
                        <div ref={FooterRef} id="summernote"/>
                    </div>
                    <button type="submit" className='btn btn-primary w-full'>Add Website</button>
                </form>
            </div>
        </SlideModal>
        {/* end */}
        {/* Edit Modal */}
        <SlideModal
        isOpen={isEditOpen}
        onClose={() => onEditClose()}
        title="Edit Setting"
        >
            <div className='p-15'>
                <form onSubmit={onEditSubmit}>
                    <div className="form-group mb-15">
                        <label>Website URL</label>
                        <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter website URL" 
                        value={editData.url_web}
                        onChange={(e) => setEditData({...editData, url_web: e.target.value})}
                        />
                    </div>
                    <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input 
                        type="radio" 
                        className="btn-check" 
                        name="btneditradio" 
                        id="btnEditradiobootstrap" 
                        autoComplete="off" 
                        checked={editData.style_cdn === 'bootstrap'}
                        onChange={() => setEditData({...editData, style_cdn: 'bootstrap'})} 
                        />
                        <label className="btn btn-outline-primary" htmlFor="btnEditradiobootstrap">bootstrap</label>

                        <input 
                        type="radio" 
                        className="btn-check" 
                        name="btneditradio" 
                        id="btnEditradioTailwind" 
                        autoComplete="off" 
                        checked={editData.style_cdn === 'tailwind'}
                        onChange={() => {setEditData({...editData, style_cdn: 'tailwind'})}}
                        />
                        <label className="btn btn-outline-primary" htmlFor="btnEditradioTailwind">Tailwind</label>
                    </div>
                    <div className="mb-15">
                        <label>Header HTML</label>
                        <div ref={editHeaderRef} id="summernote"/>
                    </div>
                    <div className="mb-15">
                        <label>Footer HTML</label>
                        <div ref={editFooterRef} id="summernote"/>
                    </div>
                    <button type="submit" className='btn btn-primary w-full'>Save Changes</button>
                </form>
            </div>
        </SlideModal>
        {/* end */}
        </>
    )
}

export default WebsiteSetting;