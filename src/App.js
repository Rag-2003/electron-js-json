// App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // Check if the magical bridge (electronAPI) exists
  const isElectronAPIAvailable = () => {
    return window.Electron && 
           typeof window.Electron.writeJsonFile === 'function' &&
           typeof window.Electron.readJsonFile === 'function';
  };

  const initialProductData = {
    product_id: 654321,
    title: "Product A",
    price: 15000.00,
    sku: "1307A 0101000"
  };

  const handleWriteFile = async () => {
    // Magical bridge check
    if (!isElectronAPIAvailable()) {
      setError('Electron API is not available. Are you running in Electron?');
      return;
    }

    try {
      const result = await window.Electron.writeJsonFile(initialProductData);
      if (result.success) {
        await loadProducts();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const loadProducts = async () => {
    if (!isElectronAPIAvailable()) {
      setError('Electron API is not available. Are you running in Electron?');
      return;
    }

    try {
      const result = await window.Electron.readJsonFile();
      if (result.success) {
        setProducts([result.data]);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // When the page loads, try to write the file
  useEffect(() => {
    handleWriteFile();
  }, []);

  return (
    <div>
      <h1>Product Management</h1>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleWriteFile}>Write JSON</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Title</th>
            <th>Price (INR)</th>
            <th>SKU</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.product_id}</td>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.sku}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;