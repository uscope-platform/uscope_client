
export {addApplication, loadApplications, removeApplication, updateApplication, saveParameter} from './Reducers/applicationSlice.js'
export {removeBitstream, AddBitstream, loadAllBitstreams} from "./Reducers/bitstreamSlice.js"
export {loadAllEmulators, addEmulator, removeEmulator, update_emulator} from "./Reducers/emulatorSlice.js"
export {AddFilter, removeFilter, loadAllFilters} from "./Reducers/filterSlice.js"
export {addPeripheral, loadPeripherals, removePeripheral, removeField, removeRegister, upsertField, upsertRegister} from "./Actions/peripheralsActions.js"
export {AddScript, loadAllScripts, removeScript, saveScriptsWorkspace} from "./Actions/scriptsActions.js"
export {AddProgram,loadAllPrograms, removeProgram} from "./Actions/ProgramsActions.js"