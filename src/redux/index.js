
export {addApplication, loadApplications, removeApplication, updateApplication, saveParameter} from './Reducers/applicationSlice'
export {removeBitstream, AddBitstream, loadAllBitstreams} from "./Reducers/bitstreamSlice"
export {loadAllEmulators, addEmulator, removeEmulator, update_emulator} from "./Reducers/emulatorSlice"
export {AddFilter, removeFilter, loadAllFilters} from "./Reducers/filterSlice"
export {addPeripheral, loadPeripherals, removePeripheral, removeField, removeRegister, upsertField, upsertRegister} from "./Reducers/peripheralSlice"
export {AddScript, loadAllScripts, removeScript} from "./Reducers/scriptSlice"
export {AddProgram,loadAllPrograms, removeProgram} from "./Reducers/programSlice"