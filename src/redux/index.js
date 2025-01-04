
export {addApplication, loadApplications, removeApplication, updateApplication, saveParameter} from './Actions/applicationActions.js'
export {removeBitstream, AddBitstream, loadAllBitstreams} from "./Actions/bitstreamsActions.js"
export {loadAllEmulators, addEmulator, removeEmulator, update_emulator} from "./Actions/EmulatorActions.js"
export {AddFilter, removeFilter, loadAllFilters} from "./Actions/FiltersActons.js"
export {addPeripheral, loadPeripherals, removePeripheral, removeField, removeRegister, upsertField, upsertRegister} from "./Actions/peripheralsActions.js"
export {sendRegister, loadRegisters} from "./Actions/RegisterActions.js"
export {AddScript, loadAllScripts, removeScript, saveScriptsWorkspace} from "Actions/scriptsActions.js"
export {AddProgram,loadAllPrograms, removeProgram} from "./Actions/ProgramsActions.js"