import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import '../../css/form/Form.css';

export default function Signup() {
    
    const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '', address: '', role: 'customer'
  });

  const [loading, setLoading] = useState(false);

  
    const handleChange = (e)=>{
        setForm({...form,[e.target.name]:e.target.value});
    }

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/user/signup', form);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success(`Welcome, ${data.user.name}!`);

      if (data.user.role === 'restaurant') navigate('/restaurant/dashboard');
      else if (data.user.role === 'agent') navigate('/agent/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo">Foodie.</Link>
        <h1 className="auth-heading">Join <br /><span>Foodie.</span></h1>
        <p className="auth-sub">Order food, manage your restaurant, or deliver meals.</p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-card-title">Create account</h2>
          <p className="auth-card-sub">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Login</Link>
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor='name'>Full name</label>
              <input
                type='text' name="name" id='name' placeholder="John Doe"
                onChange={handleChange} required
              />
            </div>

            <div className="auth-field">
              <label htmlFor='email'>Email</label>
              <input
                type='email' id="email" name="email"
                placeholder="you@example.com"
                onChange={handleChange} required
              />
            </div>

            <div className="auth-field">
              <label htmlFor='password'>Password</label>
              <input
                type="password" name="password"
                placeholder="••••••••"
                onChange={handleChange} required
              />
            </div>

            <div className="auth-row">
              <div className="auth-field">
                <label htmlFor='phone'>Phone</label>
                <input type='number'
                  name="phone" placeholder="+91 98765 43210"
                  onChange={handleChange} required
                />
              </div>
              <div className="auth-field">
                <label htmlFor='role'>Role</label>
                <select id='role' name="role" onChange={handleChange} required>
                  <option value="customer">Customer</option>
                  <option value="restaurant">Restaurant owner</option>
                  <option value="agent">Delivery agent</option>
                </select>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor='address'>Address</label>
              <input type="text"
                name="address" id='address' placeholder="Your delivery address"
                onChange={handleChange} required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}
