import React from 'react';
import Image from "next/image";

const Footer = () => {
  return (
    <footer className='fixed bottom-0 left-0'>
      <div className='flex items-center justify-between px-20'>
        <div className='flex items-center gap-3'>
          <Image 
            src="/header_hum.jpg"
            width={60}
            height={60}
            alt="はむ"
          />
          <p>家計簿アプリケーション</p>
        </div>
        <p>©next-project</p>
      </div>
    </footer>
  )
}

export default Footer;
