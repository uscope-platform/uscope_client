
export {addApplication, loadApplications, removeApplication, updateApplication, saveParameter} from './Slices/applicationSlice'
export {removeBitstream, AddBitstream, loadAllBitstreams} from "./Slices/bitstreamSlice"
export {loadAllEmulators, addEmulator, removeEmulator, update_emulator} from "./Slices/emulatorSlice"
export {AddFilter, removeFilter, loadAllFilters} from "./Slices/filterSlice"
export {addPeripheral, loadPeripherals, removePeripheral, removeField, removeRegister, upsertField, upsertRegister} from "./Slices/peripheralSlice"
export {AddScript, loadAllScripts, removeScript} from "./Slices/scriptSlice"
export {AddProgram,loadAllPrograms, removeProgram} from "./Slices/programSlice"