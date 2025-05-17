import axios from "axios";

const logout = async () => {
    try {
        await axios.post('http://localhost:5000/logout', {
            withCredentials: true
        });
        window.location.href = '/login'; 
    } catch (error) {
        console.error('Logout failed:', error);
    }
};


export default logout;