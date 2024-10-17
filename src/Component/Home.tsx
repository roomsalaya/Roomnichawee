import React from 'react';
import './Home.css';
import Navbar from './Navbar';
import Footer from './Footer';
import Matching from './Matching';

const Home: React.FC = () => {
    return (
        <>
            <Navbar />
            <h3>ตามหาเบ็นเท็น</h3>
                <Matching/>
            <Footer />
        </>
    );
};

export default Home;
