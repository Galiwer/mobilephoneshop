import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserService from "../../services/UserService";
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userData = await UserService.login(email, password);
            console.log('Raw login response:', userData); // Log the entire response

            if (userData.token) {
                // Clear any existing data
                localStorage.clear();
                
                // Set new authentication data
                localStorage.setItem('token', userData.token);
                
                // Make sure we have a role and it's in the correct format
                const role = userData.role || userData.userRole || userData.user?.role || 'USER';
                const normalizedRole = role.toUpperCase();
                localStorage.setItem('role', normalizedRole);
                
                console.log('Authentication data set:', {
                    token: userData.token ? 'present' : 'missing',
                    originalRole: role,
                    normalizedRole: normalizedRole,
                    storedRole: localStorage.getItem('role'),
                    fullUserData: userData
                });

                // Navigate to home page
                navigate('/', { replace: true });
                
                // Force a reload to ensure all components update
                window.location.reload();
            } else {
                console.error('Login response missing token:', userData);
                setError(userData.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error details:', {
                error: error,
                response: error.response,
                data: error.response?.data
            });
            setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required 
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage; 