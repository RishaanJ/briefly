import React from 'react';

function ChatMessage({ Text, Pfp, Time, sent }) {
    return (
        <div className={`message-container ${sent ? 'sent' : 'received'}`}>
            <img src={Pfp} alt="Profile" className='profile-photo' />
            <div className={`message ${sent ? 'sent' : 'received'}`}>
                <p>{Text}</p>
                <span className='timestamp'>{Time}</span>
            </div>
        </div>
    );
}

export default ChatMessage;
