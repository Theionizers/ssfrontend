import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const AdminGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const { token } = useAuth();

    const [caption, setCaption] = useState('');
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const fetchImages = () => {
        setLoading(true);
        api.get('/api/gallery/')
            .then(res => {
                setImages(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        const data = new FormData();
        data.append('image', file);
        data.append('caption', caption);
        try {
            await api.post('/api/gallery/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${token}`,
                },
            });
            setCaption('');
            setFile(null);
            setPreview(null);
            setShowForm(false);
            fetchImages();
            alert('Image uploaded');
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        }
    };

    const deleteImage = async (id) => {
        if (!window.confirm('Delete this image?')) return;
        try {
            await api.delete(`/api/gallery/${id}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            fetchImages();
        } catch (err) {
            console.error(err);
            alert('Failed to delete');
        }
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div>
            <div className="admin-header">
                <h1>Gallery Management</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Image'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card gallery-form">
                    <h3>Upload Gallery Image</h3>
                    <form onSubmit={handleUpload}>
                        <div className="form-group">
                            <label>Caption (optional)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Image</label>
                            <div
                                className="image-upload"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <span className="upload-icon">📷</span>
                                <p>Click to choose an image</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                {preview && (
                                    <img src={preview} alt="Preview" className="image-preview" />
                                )}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Upload
                        </button>
                    </form>
                </div>
            )}

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Preview</th>
                            <th>Caption</th>
                            <th>Uploaded</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.map(img => (
                            <tr key={img.id}>
                                <td>
                                    <img
                                        src={img.image}
                                        alt={img.caption}
                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </td>
                                <td>{img.caption || '-'}</td>
                                <td>{new Date(img.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteImage(img.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {images.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No images yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminGallery;
