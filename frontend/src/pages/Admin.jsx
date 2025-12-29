import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Admin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const [token, setToken] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Login form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Add product form state
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Men',
        subCategory: 'Topwear',
        sizes: ['S', 'M', 'L'],
        bestseller: false
    });
    const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null });

    // Admin Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(backendUrl + '/api/user/admin', { email, password });
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem('adminToken', response.data.token);
                setIsLoggedIn(true);
                toast.success('Admin login successful!');
                loadProducts(response.data.token);
                loadOrders(response.data.token);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    // Load Products
    const loadProducts = async (adminToken) => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Load Orders
    const loadOrders = async (adminToken) => {
        try {
            const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token: adminToken || token } });
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Add Product
    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', productForm.name);
            formData.append('description', productForm.description);
            formData.append('price', productForm.price);
            formData.append('category', productForm.category);
            formData.append('subCategory', productForm.subCategory);
            formData.append('sizes', JSON.stringify(productForm.sizes));
            formData.append('bestseller', productForm.bestseller);

            if (images.image1) formData.append('image1', images.image1);
            if (images.image2) formData.append('image2', images.image2);
            if (images.image3) formData.append('image3', images.image3);
            if (images.image4) formData.append('image4', images.image4);

            const response = await axios.post(backendUrl + '/api/product/add', formData, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success('Product added successfully!');
                setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    category: 'Men',
                    subCategory: 'Topwear',
                    sizes: ['S', 'M', 'L'],
                    bestseller: false
                });
                setImages({ image1: null, image2: null, image3: null, image4: null });
                loadProducts(token);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add product');
        }
        setLoading(false);
    };

    // Remove Product
    const handleRemoveProduct = async (id) => {
        if (!confirm('Are you sure you want to remove this product?')) return;
        try {
            const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
            if (response.data.success) {
                toast.success('Product removed!');
                loadProducts(token);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to remove product');
        }
    };

    // Update Order Status
    const handleUpdateStatus = async (orderId, status) => {
        try {
            const response = await axios.post(backendUrl + '/api/order/status', { orderId, status }, { headers: { token } });
            if (response.data.success) {
                toast.success('Status updated!');
                loadOrders(token);
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    // Check for saved admin token
    useEffect(() => {
        const savedToken = localStorage.getItem('adminToken');
        if (savedToken) {
            setToken(savedToken);
            setIsLoggedIn(true);
            loadProducts(savedToken);
            loadOrders(savedToken);
        }
    }, []);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setToken('');
        setIsLoggedIn(false);
        setProducts([]);
        setOrders([]);
    };

    if (!isLoggedIn) {
        return (
            <div className='min-h-[80vh] flex items-center justify-center'>
                <form onSubmit={handleLogin} className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
                    <h2 className='text-2xl font-bold mb-6 text-center'>Admin Login</h2>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2'>Email</label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full px-3 py-2 border rounded'
                            required
                        />
                    </div>
                    <div className='mb-6'>
                        <label className='block text-gray-700 mb-2'>Password</label>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full px-3 py-2 border rounded'
                            required
                        />
                    </div>
                    <button type='submit' className='w-full bg-black text-white py-2 rounded hover:bg-gray-800'>
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className='pt-10'>
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-3xl font-bold'>Admin Panel</h1>
                <button onClick={handleLogout} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
                    Logout
                </button>
            </div>

            {/* Tabs */}
            <div className='flex gap-4 mb-8 border-b'>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`pb-2 px-4 ${activeTab === 'products' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                >
                    Products ({products.length})
                </button>
                <button
                    onClick={() => setActiveTab('add')}
                    className={`pb-2 px-4 ${activeTab === 'add' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                >
                    Add Product
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`pb-2 px-4 ${activeTab === 'orders' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                >
                    Orders ({orders.length})
                </button>
            </div>

            {/* Products List */}
            {activeTab === 'products' && (
                <div>
                    <h2 className='text-xl font-medium mb-4'>All Products</h2>
                    {products.length === 0 ? (
                        <p className='text-gray-500'>No products found. Add some products first.</p>
                    ) : (
                        <div className='grid gap-4'>
                            {products.map((product) => (
                                <div key={product._id} className='flex items-center gap-4 p-4 border rounded'>
                                    <img src={product.image?.[0]} alt='' className='w-16 h-16 object-cover rounded' />
                                    <div className='flex-1'>
                                        <h3 className='font-medium'>{product.name}</h3>
                                        <p className='text-gray-500 text-sm'>{product.category} - {product.subCategory}</p>
                                        <p className='text-green-600 font-medium'>${product.price}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveProduct(product._id)}
                                        className='bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200'
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add Product Form */}
            {activeTab === 'add' && (
                <form onSubmit={handleAddProduct} className='max-w-2xl'>
                    <h2 className='text-xl font-medium mb-4'>Add New Product</h2>

                    <div className='grid grid-cols-2 gap-4 mb-4'>
                        <div>
                            <label className='block text-gray-700 mb-1'>Product Name</label>
                            <input
                                type='text'
                                value={productForm.name}
                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                className='w-full px-3 py-2 border rounded'
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-gray-700 mb-1'>Price ($)</label>
                            <input
                                type='number'
                                value={productForm.price}
                                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                className='w-full px-3 py-2 border rounded'
                                required
                            />
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-1'>Description</label>
                        <textarea
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            className='w-full px-3 py-2 border rounded'
                            rows={3}
                            required
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4 mb-4'>
                        <div>
                            <label className='block text-gray-700 mb-1'>Category</label>
                            <select
                                value={productForm.category}
                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                className='w-full px-3 py-2 border rounded'
                            >
                                <option value='Men'>Men</option>
                                <option value='Women'>Women</option>
                                <option value='Kids'>Kids</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-gray-700 mb-1'>Sub Category</label>
                            <select
                                value={productForm.subCategory}
                                onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                                className='w-full px-3 py-2 border rounded'
                            >
                                <option value='Topwear'>Topwear</option>
                                <option value='Bottomwear'>Bottomwear</option>
                                <option value='Winterwear'>Winterwear</option>
                            </select>
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2'>Product Images</label>
                        <div className='grid grid-cols-4 gap-4'>
                            {['image1', 'image2', 'image3', 'image4'].map((key, i) => (
                                <div key={key} className='border-2 border-dashed rounded p-4 text-center'>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        onChange={(e) => setImages({ ...images, [key]: e.target.files[0] })}
                                        className='hidden'
                                        id={key}
                                    />
                                    <label htmlFor={key} className='cursor-pointer text-gray-500 text-sm'>
                                        {images[key] ? images[key].name.substring(0, 10) + '...' : `Image ${i + 1}`}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mb-6'>
                        <label className='flex items-center gap-2'>
                            <input
                                type='checkbox'
                                checked={productForm.bestseller}
                                onChange={(e) => setProductForm({ ...productForm, bestseller: e.target.checked })}
                            />
                            <span>Bestseller</span>
                        </label>
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400'
                    >
                        {loading ? 'Adding...' : 'Add Product'}
                    </button>
                </form>
            )}

            {/* Orders List */}
            {activeTab === 'orders' && (
                <div>
                    <h2 className='text-xl font-medium mb-4'>All Orders</h2>
                    {orders.length === 0 ? (
                        <p className='text-gray-500'>No orders yet.</p>
                    ) : (
                        <div className='grid gap-4'>
                            {orders.map((order) => (
                                <div key={order._id} className='p-4 border rounded'>
                                    <div className='flex justify-between items-start mb-3'>
                                        <div>
                                            <p className='font-medium'>Order #{order._id.slice(-8)}</p>
                                            <p className='text-sm text-gray-500'>{new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='font-medium text-green-600'>${order.amount}</p>
                                            <p className='text-sm text-gray-500'>{order.paymentMethod}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                            className='px-3 py-1 border rounded text-sm'
                                        >
                                            <option value='Order Placed'>Order Placed</option>
                                            <option value='Packing'>Packing</option>
                                            <option value='Shipped'>Shipped</option>
                                            <option value='Out for Delivery'>Out for Delivery</option>
                                            <option value='Delivered'>Delivered</option>
                                        </select>
                                        <span className={`text-sm px-2 py-1 rounded ${order.payment ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                            {order.payment ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Admin;
