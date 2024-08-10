import React, { useEffect } from 'react';



function Main(){
    useEffect(() => {
        document.title = "Main Page - Briefly";
    }, []);
    return (
        <>
            <h1>Hey</h1>
        </>
    )
}

export default Main;