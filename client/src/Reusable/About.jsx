import React from 'react';
import Banner from '../assets/Banner.webp'

const About = () => {
  return (
    <div id="about">
   
      <div 
        className="bg-red-100 text-white py-20 text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        <h1 className="text-4xl font-bold">Welcome to MyBookstore</h1>
        <p className="mt-4 text-lg">Discover the world of books with us!</p>
      </div>

      <div className='bg-red-50'>
      <div className="container mx-auto px-4 py-10 bg-red-50" >
        <h2 className="text-2xl font-bold mb-4">About Us</h2>
        <p className=" text-lg leading-relaxed">
          At MyBookstore, we believe in the power of stories and knowledge. Our store offers a
          wide range of books, from timeless classics to the latest bestsellers. Whether you are
          a passionate reader or just beginning your literary journey, we strive to create an
          inviting space where everyone can find their next great read.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          Our mission is to bring the joy of reading to our community by providing a carefully
          curated selection of books and fostering a love for literature. Join us on this
          wonderful adventure and explore the endless possibilities that books offer.
        </p>
      </div>
    </div>
    </div>
  );
};

export default About;
