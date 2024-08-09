import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check if the user is already authenticated on component mount
  useEffect(() => {
    const storedAuthStatus = sessionStorage.getItem('isAuthenticated');
    if (storedAuthStatus && storedAuthStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    // Mock login logic for demonstration purposes
    const loggedIn = true; // Assume the user is successfully logged in

    if (loggedIn) {
      // Update the authentication status
      setIsAuthenticated(true);
      // Store the authentication status in session storage
      sessionStorage.setItem('isAuthenticated', 'true');
      // Redirect to the study material page if authenticated
      router.push('/courses');
    } else {
      // Handle login failure
      console.log('Login failed');
    }
  };

  const handleLogout = () => {
    // Clear authentication status from session storage
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        className="block mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        className="block mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" 
      />
      <button 
        onClick={handleLogin} 
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-300"
      >
        Login
      </button>
      {/* <p className="mt-4">Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline" legacyBehavior>Sign up</Link></p> */}
    </div>
  );
};

export default LoginPage;
