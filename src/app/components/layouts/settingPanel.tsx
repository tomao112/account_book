// SettingPanel.tsx
import React from 'react';
import Contact from './contact';

interface SettingPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onContactClick: () => void; //お問い合わせ
}

const SettingPanel: React.FC<SettingPanelProps> = ({ isOpen, onContactClick }) => {
    return (
        <div className={`flex fixed z-40 top-0 right-0 h-full w-[90%] bg-white shadow-lg transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className='flex flex-col border'>
              <ul className='flex flex-col pt-10 gap-3 w-[20rem] items-center'>
                <li><button className='border-b w-[8rem] pb-3'>会員情報</button></li>
                {/* <li><button>ダークモード</button></li> */}
                <li><button onClick={onContactClick} className='border-b w-[8rem] pb-3'>お問い合わせ</button></li>
              </ul>
            </div>
            <div className='h-full w-[90%]'>
              <Contact />
            </div>
        </div>
    );
};

export default SettingPanel;