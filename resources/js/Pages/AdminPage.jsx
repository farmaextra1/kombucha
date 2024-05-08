import React, { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function AdminPage({ products, orders, categories }) {
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingProductImagePreview, setEditingProductImagePreview] = useState('');
    const [newProductImagePreview, setNewProductImagePreview] = useState('');

    // New Product Form
    const { data: newProduct, setData: setNewProduct, post, processing: addProcessing, reset: resetNewProduct } = useForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image: null,
    });

    const handleAddProduct = () => {
        post(route('admin.addProduct'), {
            onSuccess: () => {
                resetNewProduct();
                setNewProductImagePreview('');
                alert('Product added successfully.');
            },
            onError: () => {
                alert('Error adding product.');
            }
        });
    };

    // Edited Product Form
    const { data: editedProduct, setData: setEditedProduct, put, processing: updateProcessing, reset: resetEditedProduct } = useForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image: null,
    });

    useEffect(() => {
        if (editingProduct) {
            setEditedProduct({
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price,
                stock: editingProduct.stock,
                category_id: editingProduct.category_id,
                image: editingProduct.image,
            });
            // Set the image preview for the edited product
            setEditingProductImagePreview(editingProduct.image ? `/storage/${editingProduct.image}` : '');
        } else {
            resetEditedProduct();
        }
    }, [editingProduct]);
    

    const handleEditProduct = (product) => {
        setEditingProduct(product);
    };

    const handleUpdateProduct = () => {
        put(route('admin.updateProduct', editingProduct.id), {
            onSuccess: () => {
                setEditingProduct(null);
                resetEditedProduct();
                setEditingProductImagePreview('');
                alert('Product updated successfully.');
            },
            onError: () => {
                alert('Error updating product.');
            }
        });
    };

    const handleDeleteProduct = (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            put(route('admin.deleteProduct', productId), {
                onSuccess: () => {
                    alert('Product deleted successfully.');
                },
                onError: () => {
                    alert('Error updating product.');
                }
            });
        };
    }


    const handleNewProductImageChange = (e) => {
        const file = e.target.files[0];
        setNewProduct('image', file);
        setNewProductImagePreview(URL.createObjectURL(file));
    };

    const handleEditedProductImageChange = (e) => {
        const file = e.target.files[0];
        setEditedProduct('image', file);
        setEditingProductImagePreview(URL.createObjectURL(file));
    };


    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="container mx-auto px-4">
                <h1 className="text-2xl mb-4">Admin Dashboard</h1>

                <h2 className="text-xl mb-2">Products</h2>
                <table className="table-auto w-full mb-4">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Stock</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="border px-4 py-2">
                                    {product.image ? (
                                        <img 
                                            src={`/storage/${product.image}`} 
                                            alt={product.name} 
                                            className="w-16 h-16 object-cover" // Adjust size as needed
                                        />
                                    ) : (
                                        'No Image'
                                    )}
                                </td>
                                <td className="border px-4 py-2">{product.name}</td>
                                <td className="border px-4 py-2">{product.description}</td>
                                <td className="border px-4 py-2">{product.price}</td>
                                <td className="border px-4 py-2">{product.stock}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                                        onClick={() => handleEditProduct(product)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3 className="text-lg mb-2">Add Product</h3>
                <div className="mb-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct('name', e.target.value)}
                        className="border rounded py-1 px-2 mr-2"
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct('description', e.target.value)}
                        className="border rounded py-1 px-2 mr-2"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct('price', e.target.value)}
                        className="border rounded py-1 px-2 mr-2"
                    />
                    <input
                        type="number"
                        name="stock"
                        placeholder="Stock"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct('stock', e.target.value)}
                        className="border rounded py-1 px-2 mr-2"
                    />

                    <select
                        name="category_id"
                        value={newProduct.category_id}
                        onChange={(e) => setNewProduct('category_id', e.target.value)}
                        className="border rounded py-1 px-2 mr-2"
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleNewProductImageChange}
                    />
                    {newProductImagePreview && (
                        <img 
                            src={newProductImagePreview} 
                            alt="Preview" 
                            className="w-16 h-16 object-cover mb-2"
                        />
                    )}
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                        onClick={handleAddProduct}
                        disabled={addProcessing}
                    >
                        {addProcessing ? 'Adding...' : 'Add'}
                    </button>
                </div>

                {editingProduct && (
                    <div className="mb-4">
                        <h3 className="text-lg mb-2">Edit Product</h3>
                        {editingProductImagePreview && (
                            <img 
                                src={editingProductImagePreview} 
                                alt="Preview" 
                                className="w-16 h-16 object-cover mb-2"
                            />
                        )}
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={editedProduct.name}
                            onChange={(e) => setEditedProduct('name', e.target.value)}
                            className="border rounded py-1 px-2 mr-2"
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={editedProduct.description}
                            onChange={(e) => setEditedProduct('description', e.target.value)}
                            className="border rounded py-1 px-2 mr-2"
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={editedProduct.price}
                            onChange={(e) => setEditedProduct('price', e.target.value)}
                            className="border rounded py-1 px-2 mr-2"
                        />
                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={editedProduct.stock}
                            onChange={(e) => setEditedProduct('stock', e.target.value)}
                            className="border rounded py-1 px-2 mr-2"
                        />
                        <select
                            name="category_id"
                            value={editedProduct.category_id}
                            onChange={(e) => setEditedProduct('category_id', e.target.value)}
                            className="border rounded py-1 px-2 mr-2"
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleEditedProductImageChange}
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                            onClick={handleUpdateProduct}
                            disabled={updateProcessing}
                        >
                            {updateProcessing ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                )}

    
            </div>
        </>
    );
}
