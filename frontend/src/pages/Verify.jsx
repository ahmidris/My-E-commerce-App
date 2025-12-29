import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/shopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParams] = useSearchParams();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        try {
            if (!token) {
                return null;
            }

            const response = await axios.post(
                backendUrl + '/api/order/verifyStripe',
                { success, orderId },
                { headers: { token } }
            );

            if (response.data.success) {
                setCartItems({});
                toast.success('Payment successful! Order confirmed.');
                navigate('/orders');
            } else {
                toast.error('Payment failed. Please try again.');
                navigate('/cart');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            navigate('/cart');
        }
    };

    useEffect(() => {
        verifyPayment();
    }, [token]);

    return (
        <div className='min-h-[60vh] flex items-center justify-center'>
            <div className='text-center'>
                <div className='w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto'></div>
                <p className='mt-4 text-gray-600'>Verifying payment...</p>
            </div>
        </div>
    );
};

export default Verify;
