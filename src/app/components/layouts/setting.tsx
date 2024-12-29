'use client';

import React from 'react';
import { useState } from 'react';
import 'primeicons/primeicons.css';
import SettingPanel from './settingPanel';

const Setting = () => {
  const [ isPanelOpen, setIsPanelOpen ] = useState(false);
  const [ showContact, setShowContact ] = useState(false);

  const handleTogglePanel = () => {
    setIsPanelOpen(prevState => !prevState);
  }

  const handleContact = () => {
    setShowContact(true);
  }

  return (
    <div className='z-[100]'>
      <div className='fixed top-1/3 right-0'>
        <div className='flex justify-end'>
          <button onClick={handleTogglePanel} className='z-50 bg-blue-400 rounded-tl-full rounded-bl-full pr-5 pl-3 pt-3 pb-3'>
            <span className='pi pi-cog' style={{ fontSize: '3rem', color: 'white'}}></span>
          </button>
          <SettingPanel 
            isOpen={isPanelOpen} 
            onClose={handleTogglePanel}
            onContactClick={handleContact}
            />
        </div>
      </div>
    </div>
  )
}

export default Setting
