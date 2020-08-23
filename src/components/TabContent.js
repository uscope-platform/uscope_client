import React, {Suspense} from 'react';


const PlotTab = React.lazy(() => import('./plot_tab_components/PlotTab'));
const RegisterTab = React.lazy(() => import('./register_tab_components/Register_tab'));
const ScriptManager = React.lazy(() => import('./Managers/ScriptManager'));
const PeripheralsManager = React.lazy(() => import('./Managers/PeripheralsManager'));
const ApplicationsManager = React.lazy(() => import('./Managers/ApplicationsManager'));
const ProgramsManager = React.lazy(()=> import('./Managers/ProgramsManager'));

let TabContent = props => {
    if(props.tab.type==='Scope'){
        return(
            <Suspense fallback={<div>Loading...</div>}>
                <PlotTab content={props.tab}/>
            </Suspense>
        );
    } else if(props.tab.type==='Registers') {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <RegisterTab content={props.tab}/>
            </Suspense>
        );
    }else if(props.tab.type ==='script_manager'){
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <ScriptManager />
            </Suspense>
        );
    }else if(props.tab.type ==='peripherals_manager'){
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <PeripheralsManager />
            </Suspense>
        );
    }else if(props.tab.type ==='applications_manager'){
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <ApplicationsManager />
            </Suspense>
        );
    }else if(props.tab.type ==='program_manager'){
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <ProgramsManager />
            </Suspense>
        );
    }else{
        return null
    }
};

export default TabContent;
