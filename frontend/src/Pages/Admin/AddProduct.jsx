import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../../App';
import './Admin.css';
import upload_area from '../../Components/Assets/admin/upload_area.svg';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'men',
    new_price: '',
    old_price: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append('product', file);

      try {
        const response = await fetch(`${backend_url}/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          setFormData((prev) => ({
            ...prev,
            image: `${backend_url}${data.image_url}`,
          }));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backend_url}/addproduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="add-product-form">
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Image</label>
          <div className="image-upload-area" onClick={() => document.getElementById('imageInput').click()}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <img src={upload_area} alt="Upload area" className="upload-icon" />
            )}
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kids</option>
          </select>
        </div>
        <div className="form-group">
          <label>New Price</label>
          <input
            type="number"
            name="new_price"
            value={formData.new_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Old Price</label>
          <input
            type="number"
            name="old_price"
            value={formData.old_price}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct; 