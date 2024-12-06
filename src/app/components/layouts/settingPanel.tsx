// SettingPanel.tsx
import React from 'react';

interface SettingPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingPanel: React.FC<SettingPanelProps> = ({ isOpen }) => {
    return (
        <div className={`flex fixed z-40 top-0 right-0 h-full w-[90%] bg-white shadow-lg transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className='flex flex-col pl-20 border'>
              <ul className='flex flex-col pt-10 gap-3 w-[20rem]'>
                <li className=''><button>会員情報</button></li>
                <li><button>ダークモード</button></li>
                <li><button>お問い合わせ</button></li>
              </ul>
            </div>
            <div className='h-full w-[90%]'>
          </div>
        </div>
    );
};

export default SettingPanel;