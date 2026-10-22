# Type-escape map

Snapshot of the places in `src` where the TypeScript conversion left escape hatches. 237 TS/TSX files, no JS left, `strict: true`, module resolution `bundler`. Counts come from grep; `npx tsc --noEmit` is clean.

Updated after the Plotly and reaflow typing work (commits `8008ad6` and `acc9e07`).

| Escape | Count |
|---|---|
| Explicit `any` (`: any`, `<any>`, `any[]`, `Record<string, any>`, index signatures) | ~135 (was ~150) |
| `as any` | 16 |
| `as unknown as` | 3 |
| `@ts-ignore` | 0 (was 9) |
| `!` non-null assertions (excluding the generated `parser.ts`) | 11 |
| `new Function(...)` | 1 |

There are no `@ts-nocheck`, `@ts-expect-error` or `eslint-disable`.

## Resolved
- **Plotly:** `plotly.js` and `react-plotly.js` 4.x ship their own types, so the 7 `@ts-ignore`s on their imports and the `@types/plotly.js*` devDependencies are gone. `plotly.js-basic-dist` has no types, so [src/plotly-basic-dist.d.ts](src/plotly-basic-dist.d.ts) maps it to the `plotly.js` ones. `ScopePlotly.restyle` takes its div and return types from Plotly; its `update` stays `Record<string, unknown>` because the scope passes one `Float32Array` per trace, which Plotly's `restyle` typing rejects.
- **Reaflow:** the `@ts-ignore` is gone and `EmulatorDiagram.tsx` is typed against reaflow's `NodeData` and `EdgeData`. The model keeps its numeric ids and they are converted to reaflow's string ids at the boundary. The `event: any` of its handlers and of the three handlers in `FcoreEmulationEditor.tsx` are gone.
- **Xterm:** the `@ts-ignore` on the `xterm/css/xterm.css` import was not needed, `vite/client` already declares `*.css`.
- **Module resolution:** `nodenext` was replaced by `esnext` + `bundler`, which matches how Vite resolves modules. Reaflow's typings only resolve that way, and `new Ajv2020.default()` became `new Ajv2020()`.

## By cause

**2. Generic edit-by-field-name mutators (8 `as any`, most structural).** `(obj as any)[field] = value` appears in:
- `up_application.ts`: lines 496, 516, 562, 583, 607, 628, 692, plus `field_value: any` on the matching `edit_*` signatures.
- [up_program.ts:99](src/client_core/data_models/up_program.ts) and [register_proxy.ts:43](src/client_core/data_models/register_proxy.ts).
- Fix: a generic helper such as `set_field<T, K extends keyof T>(obj: T, key: K, value: T[K])` removes all of them. It needs the field name typed as `keyof` the entity, so the callers change too.

**3. Loose domain interfaces at the core.** Everything downstream inherits these, so fixing them has the most reach.
- [application.ts](src/interfaces/client_core/application.ts) (`[index: string]: any` at lines 21 and 116, `miscellaneous`, `io: any[]`, `item: any`).
- [filter.ts:24](src/interfaces/client_core/filter.ts) (index signature).
- [emulator.ts:65-67,100](src/interfaces/client_core/emulator.ts) (`value`, `file`, `series`).
- [redux.ts:65,70](src/interfaces/redux.ts) (`obj: any` in action payloads).
- [app.ts:22](src/interfaces/app.ts).
- [types.ts:33](src/interfaces/client_core/scripting/types.ts).

**4. Untyped data classes.**
- `up_emulation_result.ts`: `data`, `inputs`, `selected_data_series`, and `res_obj` in the constructor.
- `up_application.ts`: `miscellaneous: any` and `load_core(core: any, program: any | null)`.
- `up_emulator.ts`: lines 127, 225, 391, 746 and 796.
- `up_filter.ts` and `filter_calculate_keepouts`: `Record<string, any>` parameters.
- `diff_common.ts` and `application_diff_engine.ts`: `Record<string, any>` parameters.

**5. Backend, IO and cache boundary.** `any` is defensible at this edge, but `unknown` plus validation would be better.
- `proxy/backend.ts`: `auth_config: any`, and `T = any` defaults on `backend_get` and `backend_post`.
- `scope_stream.ts`: lines 42, 92 and 195.
- `cache_handling.ts`: `load_fcn: any`, `hash_fcn: any` and the callback results.
- `downloads.ts`, `platform.ts` (`restore_database(db_file: any)`), `import.ts` (`validate_json`) and `scripting/backend.ts` (`writes: any[]`).
- [errors.ts:33-34](src/client_core/proxy/errors.ts) does two `as any` casts right after a `typeof` check. Narrowing to `Record<string, unknown>` fixes it.
- The 3 `as unknown as` casts are all in [import.ts:85,89,192](src/client_core/data_handling/import.ts), converting `up_application` and `up_peripheral` to their raw interfaces.

**6. Third-party callback and style typing, the cheapest wins.** The `react-select` style callbacks (`provided: any, {…}: any`), duplicated across several files. `StylesConfig` from `react-select` types them for free.
- [Select.tsx:60-87](src/components/UI_elements/Select.tsx)
- [MultiSelect.tsx:45-93](src/components/UI_elements/MultiSelect.tsx)
- [RangedInputField.tsx:64-111](src/components/UI_elements/RangedInputField.tsx)

**7. Generic component props.** The worst single file is [SidebarBase.tsx](src/components/UI_elements/Sidebar/SidebarBase.tsx) with 17: `objects: any`, `template: any`, and every callback item. Making it generic (`SidebarBase<T>`) would clean up its consumers too (`ProgramSidebar`, `ScriptSidebar`, `ApplicationsManager`). Others:
- [TwoColumnSelector.tsx](src/components/UI_elements/TwoColumnSelector.tsx)
- [SelectableList.tsx](src/components/UI_elements/SelectableList.tsx)
- [TabContent.tsx:31,36](src/components/TabContent.tsx)
- [Navbar.tsx:29,34](src/components/Navbar.tsx)
- [LoginPage.tsx:51](src/components/Common_Components/LoginPage.tsx)
- [TextEditor.tsx:29](src/components/UI_elements/TextEditor.tsx)

**8. Event handlers typed `event: any`.**
- `EmulatorDiagram.tsx` and `FcoreEmulationEditor.tsx` are done.
- Remaining: `AppChooser`, `BuildSettings`, `ProgramsManager`, `Settings_view`, `SelectableListItem`.

**9. One-offs.**
- [HilPlot.tsx:44-45](src/components/Views/Emulators/HilControl/HilPlot.tsx): `1100 as any` for a layout width.
- [PlatformManager.tsx:48](src/components/Views/Platform/PlatformManager.tsx): `(event.currentTarget.role as any)?.value`.
- [FilterManager.tsx:50](src/components/Views/Filters/FilterManager.tsx): `useState([] as any[])`.
- [store.ts:48](src/store.ts): `(state as any).data`, inside the devtools sanitizer.
- `catch (e: any)` in `up_emulator.ts:127` and `FilterManager.tsx:87`.
- [frontend.ts:22](src/client_core/scripting/frontend.ts): `new Function(...)` is inherently untyped, but it's a scripting feature, so it's probably intentional.

**10. Non-null assertions (13).** These come from `noUncheckedIndexedAccess`, and they are mostly benign.
- Redux slices: [peripheralSlice.ts](src/redux/Slices/peripheralSlice.ts) (4 sites) and [applicationSlice.ts:27,30](src/redux/Slices/applicationSlice.ts).
- Other places: `terminal_backend.ts:208`, `script_runner.ts:147`, `Settings_view.tsx:125,160` and `PlotComponent.tsx:92`.
- The redux ones are real runtime-crash risks if an id is stale. Settings_view has a double `!` chain.

## Where it concentrates
Files with the most `any`:
- `SidebarBase.tsx`: 17
- `up_application.ts`: 16
- `MultiSelect.tsx`: 9
- `BuildSettings.tsx`, `FilterPlot.tsx` and `RangedInputField.tsx`: 7 each
- `cache_handling.ts`: 7

## Suggested order
1. Group 6. It is mechanical and removes about 30 escapes with little risk.
2. The generic field-setter in group 2.
3. The domain interfaces in group 3, which `tsc` will then propagate into groups 4, 7 and 8 as real errors to fix.

Consider adding `@typescript-eslint/no-explicit-any` as a ratchet so the count can't grow.
