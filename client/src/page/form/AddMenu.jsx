import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import '../../css/form/AddMenu.css';

export default function AddMenu() {
  const { rId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', description: '', price: '', category: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      if (image) formData.append('image', image);

      await axios.post(`/restaurants/${rId}/menu/addItem`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Menu item added!');
      navigate(`/restaurants/${rId}`);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-menu-page">
      <div className="add-menu-header">
        <button className="add-menu-back" onClick={() => navigate(-1)}>← Back</button>
        <div>
          <h1>Add Menu Item</h1>
          <p>Fill in the details to add a new dish to your menu</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="add-menu-form">

        {/* Name */}
        <div className="form-field">
          <label>Item name</label>
          <input
            name="name"
            placeholder="e.g. Butter Chicken"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="form-field">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Short description of the dish"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        {/* Price + Category */}
        <div className="add-menu-row">
          <div className="form-field">
            <label>Price (₹)</label>
            <input
              name="price"
              type="number"
              placeholder="e.g. 280"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              <option value="Starters">Starters</option>
              <option value="Main Course">Main Course</option>
              <option value="Breads">Breads</option>
              <option value="Rice">Rice</option>
              <option value="Desserts">Desserts</option>
              <option value="Drinks">Drinks</option>
            </select>
          </div>
        </div>

        {/* Image */}
        <div className="form-field">
          <label>Item image</label>
          <input type="file" accept="image/*" onChange={handleImage} required/>
        </div>

        <button type="submit" className="add-menu-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add to menu'}
        </button>
      </form>
    </div>
  );
}