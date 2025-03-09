import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { backend_url } from '../../App';
import './Admin.css';
import upload_area from '../../Components/Assets/admin/upload_area.svg';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    category: 'men',
    new_price: '',
    old_price: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${backend_url}/allproducts`);
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${backend_url}/removeproduct`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        const data = await response.json();
        if (data.success) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };
  
  const handleUpdate = async (product) => {
    setIsEditing(true);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      new_price: product.new_price,
      old_price: product.old_price,
      image: product.image,
    });
    setImagePreview(backend_url + product.image);
    setShowForm(true);
  };

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
      const endpoint = isEditing ? `${backend_url}/updateproduct` : `${backend_url}/addproduct`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setShowForm(false);
        setIsEditing(false);
        fetchProducts();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      description: '',
      category: 'men',
      new_price: '',
      old_price: '',
      image: '',
    });
    setImagePreview(null);
    setIsEditing(false);
  };

  return (
    <div className="admin-products">
      <div className="header">
        <div className="header-button">
            <h1>Manage Products</h1>
            <Link to="/admin/dashboard" className="admin-link edit-btn">
                Back to Dashboard
            </Link>
        </div>
        <button onClick={() => {
          resetForm();
          setShowForm(true);
        }} className="admin-link">
          Add New Product
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-btn" onClick={() => {
                setShowForm(false);
                resetForm();
              }}>×</button>
            </div>
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
                    required={!isEditing}
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
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loader"></div> // Replace this with your loader/spinner if needed
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={backend_url + product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.new_price}</p>
              <div className="product-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleUpdate(product)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products; 