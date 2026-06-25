import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import axios from '../../api/axios.js';
import toast from 'react-hot-toast';
import '../../css/form/Form.css';

export default function Login() {
    const navigate = useNavigate();
    const [form,setForm] = useState({email:"",password:""});
    const [loading,setLoading] = useState(false);

    const handleChange = (e)=>{
        setForm({...form,[e.target.name]:e.target.value});
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            const {data} = await axios.post('/user/login',form);

            localStorage.setItem('token',data.token);
            localStorage.setItem('user',JSON.stringify(data.user));

            toast.success(`Welcome back, ${data.user.name}!`);
            if(data.user.role === 'restaurant') navigate('/restaurant/dashboard');
            else if(data.user.role === 'agent') navigate('/agent/dashboard');
            else navigate('/');
        }
        catch(err){
             console.log(err.response);
    console.log(err.response.data);
            toast.error(err.response?.data?.msg || 'Login failed');
        }
        finally{
            setLoading(false);
        }
    }

  return (
    <>
      <div>
        <div className="auth-left">
            <Link to='/' className="auth-logo">Foodie</Link>
           <h1 className='auth-heading'>Welcome <br/><span>back.</span></h1>
            <p className="auth-sub">Sign in to order your favourite meals.</p>
        </div>
        <div className="auth-right">
            <div className="auth-card">
               <h2 className="auth-card-title">Login</h2>
          <p className="auth-card-sub">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Sign Up</Link>
          </p>  

        <form onSubmit={handleSubmit} className='auth-form'>
            <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input name="email" type="email" id='email' placeholder='u@example.com' onChange={handleChange} required />
            </div>
            <div className="auth-field">
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' name='password' onChange={handleChange} required/>
            </div>
             <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
        </form>
      </div>
         </div>
        </div>

    </>
  )
}
