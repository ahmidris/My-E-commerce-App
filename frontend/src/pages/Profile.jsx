import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/shopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
    const { token, navigate, backendUrl } = useContext(ShopContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUserData = async () => {
        try {
            if (!token) {
                navigate('/login');
                return;
            }

            // For now, we'll decode the token to get basic info
            // In a full implementation, you'd have a /api/user/profile endpoint
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error('Failed to load profile');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
    }, [token]);

    if (!token) {
        return (
            <div className='min-h-[60vh] flex items-center justify-center'>
                <p className='text-gray-500'>Please login to view your profile.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className='min-h-[60vh] flex items-center justify-center'>
                <div className='w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin'></div>
            </div>
        );
    }

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl mb-8'>
                <Title text1={'MY'} text2={'PROFILE'} />
            </div>

            <div className='max-w-2xl'>
                <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                    <h3 className='text-lg font-medium mb-4'>Account Information</h3>
                    <div className='space-y-3'>
                        <div className='flex justify-between border-b pb-2'>
                            <span className='text-gray-600'>Account Status</span>
                            <span className='text-green-600 font-medium'>Active</span>
                        </div>
                        <div className='flex justify-between border-b pb-2'>
                            <span className='text-gray-600'>Member Since</span>
                            <span className='text-gray-800'>Recently Joined</span>
                        </div>
                    </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                    <h3 className='text-lg font-medium mb-4'>Quick Actions</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <button
                            onClick={() => navigate('/orders')}
                            className='flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors'
                        >
                            <span className='text-xl'>📦</span>
                            <span>View Orders</span>
                        </button>
                        <button
                            onClick={() => navigate('/cart')}
                            className='flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors'
                        >
                            <span className='text-xl'>🛒</span>
                            <span>View Cart</span>
                        </button>
                        <button
                            onClick={() => navigate('/collection')}
                            className='flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors'
                        >
                            <span className='text-xl'>👕</span>
                            <span>Browse Collection</span>
                        </button>
                        <button
                            onClick={() => navigate('/contact')}
                            className='flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors'
                        >
                            <span className='text-xl'>📞</span>
                            <span>Contact Support</span>
                        </button>
                    </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-6'>
                    <h3 className='text-lg font-medium mb-4'>Need Help?</h3>
                    <p className='text-gray-600 text-sm'>
                        If you have any questions or concerns, please don't hesitate to contact our customer support team.
                        We're here to help you with any issues regarding your orders, payments, or products.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
