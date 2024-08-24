import React from 'react';

function ChatMessage({ Text, Pfp, Time, sent, imageUrl }) {
    return (
        <div className={`message-container ${sent ? 'sent' : 'received'}`}>
            <img src={Pfp} alt="Profile" className='profile-photo' />
            <div className={`message ${sent ? 'sent' : 'received'}`}>
                {Text && <p>{Text}</p>}
                {imageUrl && <img src={imageUrl} alt="Sent" className="message-image" />}
                <span className='timestamp'>{Time}</span>
            </div>
        </div>
    );
}

export default ChatMessage;
