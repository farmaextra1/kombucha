import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function AdminPage({ products, orders }) {
    const [editingProduct, setEditingProduct] = useState(null);
    const { data: newProduct, setData: setNewProduct, post, processing: addProcessing, reset: resetNewProduct } = useForm({
        name: '',
        description: '',
        price: '',
        stock: '',
    });

    const handleAddProduct = () => {
        post(route('admin.addProduct'), {
            onSuccess: () => {
                resetNewProduct();
                // Refresh the products list after successful addition
            },
        });
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
    };

    const { data: editedProduct, setData: setEditedProduct, put, processing: updateProcessing, reset: resetEditedProduct } = useForm({
        name: editingProduct?.name || '',
        description: editingProduct?.description || '',
        price: editingProduct?.price || '',
        stock: editingProduct?.stock || '',
    });

    const handleUpdateProduct = () => {
        put(route('admin.updateProduct', editingProduct.id), {
            onSuccess: () => {
                setEditingProduct(null);
                resetEditedProduct();
                // Refresh the products list after successful update
            },
        });
    };

    const handleDeleteProduct = (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            axios.delete(route('admin.deleteProduct', productId))
                .then(() => {
                    // Remove the deleted product from the products state
                    setProducts(products.filter((product) => product.id !== productId));
                })
                .catch((error) => {
                    console.error('Error deleting product:', error);
                });
        }
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
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                            onClick={handleUpdateProduct}
                            disabled={updateProcessing}
                        >
                            {updateProcessing ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                )}

                <h2 className="text-xl mb-2">Orders</h2>
                {/* Render the orders table */}
            </div>
        </>
    );
}