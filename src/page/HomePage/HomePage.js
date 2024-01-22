import React from 'react';
import Button from '../../component/button/index';

function HomePage() {
    return ( 
        <div>
            <Button to={"/login"}>
                Login
              </Button>
        </div>
    );
}

export default HomePage;