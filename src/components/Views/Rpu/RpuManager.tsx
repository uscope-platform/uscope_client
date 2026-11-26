// Copyright 2025 Filippo Savi
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



import React, {useEffect, useState} from "react";
import {styled} from "goober";
import {MdContentCopy, MdDownload, MdSwapHoriz} from "react-icons/md";
import {toast} from "react-toastify";

import {ColorTheme, PaneGroup, RadioGroup, Toolbar, ToolbarButton, UIPanel} from "#UI/index.js";
import {download_bitstream, up_rpu_program, upload_raw} from "#client_core/index.js";
import {error_text} from "#client_core/proxy/errors.js";
import {useAppSelector} from "#redux/hooks.js";
import RpuSidebar from "./RpuSidebar.js";
import {RPU_CORES, short_hash} from "./rpu_info.js";

const Card = styled('section')`
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  max-width: 34rem;
  margin: 0.8em;
  padding: 0.8em 1.1em 1em;
  border-radius: 8px;
  border: 1px solid ${ColorTheme.background.borders};
  background: ${ColorTheme.background.level_3};
`

const Name = styled('h3')`
  margin: 0;
  font-size: 1.05rem;
  overflow-wrap: anywhere;
`

// a label and what it is, one under the other
const Fact = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.15em;
  & > span:first-child {
    font-size: 0.8rem;
    opacity: 0.6;
  }
`

// the start of the hash, as git shows one: in a font where the characters line up and can be told apart
const Hash = styled('code')`
  display: block;
  padding: 0.4em 0.6em;
  border-radius: 5px;
  font-size: 0.85rem;
  user-select: all;
  background: ${ColorTheme.background.level_2};
`

interface RpuManagerProps {}

let RpuManager = (props: RpuManagerProps) =>{

    const programs = useAppSelector(state => state.rpu);

    const [selected_id, set_selected_id] = useState(9999);

    // read from the store at every render, so that what is edited from the list or from here shows right away
    const prog = programs[selected_id];

    // one that was loaded before the server told the hashes has none: it is asked for
    const missing_hash = prog !== undefined && prog.hash === undefined ? prog.id : null;
    useEffect(() => {
        if(missing_hash === null || programs[missing_hash] === undefined) return;
        new up_rpu_program(programs[missing_hash]).refresh_hash().catch((err) => toast.error(error_text(err)));
    }, [missing_hash]);

    const core_options = RPU_CORES.map((core) => ({value: core.toString(), label: "Core " + core}));

    let handle_core_change = async (value: string) =>{
        const core = parseInt(value, 10);
        if(prog === undefined || core === prog.core) return;
        try{
            await new up_rpu_program(prog).edit_field("core", core);
            toast.success(prog.name + " now runs on core " + core);
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    let handle_copy_hash = async () =>{
        if(prog?.hash === undefined) return;
        await navigator.clipboard.writeText(prog.hash);
        toast.success("Hash copied");
    };

    let handle_replace_file = async () =>{
        if(prog === undefined) return;
        try{
            const event = await upload_raw();
            const file = await up_rpu_program.get_file_content(event);
            await new up_rpu_program(prog).update_file({name: prog.name, content: file.content});
            toast.success("File of " + prog.name + " replaced");
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    let handle_export = async () =>{
        if(prog === undefined) return;
        try{
            const file = await new up_rpu_program(prog).export_program();
            download_bitstream(file.data, file.name);
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    return(
        <PaneGroup id="rpu_programs" orientation="horizontal">
            <UIPanel id="main" key="rpu_properties" level="level_2" default_size={72} min_size={30} collapsible={false}>
                <Toolbar>
                    <ToolbarButton label="Replace file" tooltip="Load another file in this program, keeping its name and core" icon={<MdSwapHoriz size="1.5em"/>} enabled={prog !== undefined} onClick={handle_replace_file}/>
                    <ToolbarButton label="Export" tooltip="Download the file of the program" icon={<MdDownload size="1.5em"/>} enabled={prog !== undefined} onClick={handle_export}/>
                </Toolbar>
                <div style={{flex: 1, minHeight: 0, overflowY: "auto"}}>
                    {prog === undefined
                        ? <div style={{padding: "1em", textAlign: "center", fontStyle: "italic", opacity: 0.6}}>Select an RPU program, or add one from the list</div>
                        : (
                            <Card>
                                <Name>{prog.name}</Name>
                                <Fact>
                                    <span>Target core</span>
                                    <div>
                                        <RadioGroup
                                            variant="segmented"
                                            name="rpu_core"
                                            label="Target core"
                                            value={prog.core.toString()}
                                            options={core_options}
                                            onChange={handle_core_change}
                                        />
                                    </div>
                                </Fact>
                                <Fact>
                                    <span>Version (SHA-256 of the file)</span>
                                    <div style={{display: "flex", alignItems: "flex-start", gap: "0.4em"}}>
                                        <Hash title={prog.hash}>{prog.hash !== undefined ? short_hash(prog) : "…"}</Hash>
                                        <MdContentCopy
                                            role="button"
                                            aria-label="Copy the hash"
                                            size="1.3em"
                                            color={ColorTheme.icons_color}
                                            title="Copy the whole hash" style={{cursor: "pointer", marginTop: "0.5em", opacity: prog.hash === undefined ? 0.3 : 1}}
                                            onClick={handle_copy_hash}
                                        />
                                    </div>
                                </Fact>
                            </Card>
                        )
                    }
                </div>
            </UIPanel>
            <RpuSidebar selected={selected_id} on_select={set_selected_id}/>
        </PaneGroup>
    );

}

export default RpuManager;
