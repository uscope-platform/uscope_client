//       REACT IMPORTS
import React from 'react';
import PlatformSidebar from "./Sidebar/Platform/PlatformSidebar";


let OnboardingView = (props) =>{


    return (
        <PlatformSidebar onboarding onboarding_done={props.onboarding_done}/>
    );

};

export default OnboardingView;
