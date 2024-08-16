function GroupChat({ Title, selected, onClick }) {
    return (
        <div 
            className={`chats ${selected ? 'selected' : ''}`} 
            onClick={onClick}
            data-title={Title}
        >
            <img 
                src={`https://ui-avatars.com/api/?name=${Title.replace(/ /g, '+')}&background=313338&color=dcdee1&rounded=false&bold=true&uppercase=true`} 
                className='image-for-groupchat' 
                alt="Chat" 
            />
            <h2>{Title}</h2>
        </div>
    );
}

export default GroupChat;
