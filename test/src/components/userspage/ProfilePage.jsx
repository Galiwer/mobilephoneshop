import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../../services/UserService';
import './ProfilePage.css';

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response.ourUsers);
            setError(null);
        } catch (error) {
            console.error('Error fetching profile information:', error);
            setError('Failed to load profile information. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Profile Information</h2>
                <div className="profile-info">
                    <div className="info-group">
                        <label>Name:</label>
                        <p>{profileInfo.name}</p>
                    </div>
                    <div className="info-group">
                        <label>Email:</label>
                        <p>{profileInfo.email}</p>
                    </div>
                    <div className="info-group">
                        <label>City:</label>
                        <p>{profileInfo.city}</p>
                    </div>
                    <div className="info-group">
                        <label>Role:</label>
                        <p>{profileInfo.role}</p>
                    </div>
                </div>
                {profileInfo.role === "ADMIN" && (
                    <Link 
                        to={`/update-user/${profileInfo.id}`}
                        className="update-profile-button"
                    >
                        Update Profile
                    </Link>
                )}
            </div>
        </div>
    );
}

export default ProfilePage; 