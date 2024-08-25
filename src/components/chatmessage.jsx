import React from 'react';

function ChatMessage({ Text, Pfp, Time, sent, imageUrl }) {
    return (
        <div className={`message-container ${sent ? 'sent' : 'received'}`}>
            {!sent && <img src={Pfp} alt="Profile" className='profile-photo' />}
            <div className={`message-wrapper ${sent ? 'sent' : 'received'}`}>
                {Text && <div className={`message ${sent ? 'sent' : 'received'}`}><p>{Text}</p></div>}
                <span className='timestamp'>{Time}</span>
                {imageUrl && <div className="image-bubble"><img src={imageUrl} alt="Sent" className="message-image" /></div>}
            </div>
        </div>
    );
}

export default ChatMessage;
