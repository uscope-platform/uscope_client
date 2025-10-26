
export {addApplication, loadApplications, removeApplication, updateApplication, saveParameter} from './Slices/applicationSlice.js'
export {removeBitstream, AddBitstream, loadAllBitstreams} from "./Slices/bitstreamSlice.js"
export {loadAllEmulators, addEmulator, removeEmulator, update_emulator} from "./Slices/emulatorSlice.js"
export {AddFilter, removeFilter, loadAllFilters} from "./Slices/filterSlice.js"
export {addPeripheral, loadPeripherals, removePeripheral, removeField, removeRegister, upsertField, upsertRegister} from "./Slices/peripheralSlice.js"
export {AddScript, loadAllScripts, removeScript} from "./Slices/scriptSlice.js"
export {AddProgram,loadAllPrograms, removeProgram} from "./Slices/programSlice.js"