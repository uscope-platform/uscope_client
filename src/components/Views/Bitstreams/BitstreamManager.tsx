// Copyright 2021 University of Nottingham Ningbo China
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

import {ColorTheme, PaneGroup, Toolbar, ToolbarButton, UIPanel} from "#UI/index.js";
import {download_bitstream, up_bitstream, upload_raw} from "#client_core/index.js";
import {error_text} from "#client_core/proxy/errors.js";
import {useAppSelector} from "#redux/hooks.js";
import BitstreamSidebar from "./BitstreamSidebar.js";
import {applications_using, short_hash} from "./bitstream_info.js";

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

const Chips = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em;
`

const Chip = styled('span')`
  padding: 0.15em 0.7em;
  border-radius: 1em;
  font-size: 0.85rem;
  border: 1px solid ${ColorTheme.background.bordersLight};
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

interface BitstreamManagerProps {}

let BitstreamManager = (props: BitstreamManagerProps) =>{

    const bitstreams = useAppSelector(state => state.bitstreams);
    const applications = useAppSelector(state => state.applications);

    const [selected_id, set_selected_id] = useState(9999);

    // read from the store at every render, so that what is edited from the list or from here shows right away
    const bit = bitstreams[selected_id];
    const users = bit !== undefined ? applications_using(bit.name, applications) : [];

    // one that was loaded before the server told the hashes has none: it is asked for
    const missing_hash = bit !== undefined && bit.hash === undefined ? bit.id : null;
    useEffect(() => {
        if(missing_hash === null || bitstreams[missing_hash] === undefined) return;
        new up_bitstream(bitstreams[missing_hash]).refresh_hash().catch((err) => toast.error(error_text(err)));
    }, [missing_hash]);

    let handle_copy_hash = async () =>{
        if(bit?.hash === undefined) return;
        await navigator.clipboard.writeText(bit.hash);
        toast.success("Hash copied");
    };

    let handle_replace_file = async () =>{
        if(bit === undefined) return;
        try{
            const event = await upload_raw();
            const file = await up_bitstream.get_file_content(event);
            // the name stays: the applications load the bitstream by it
            await new up_bitstream(bit).update_file({name: bit.name, content: file.content});
            toast.success("File of " + bit.name + " replaced");
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    let handle_export = async () =>{
        if(bit === undefined) return;
        try{
            const file = await new up_bitstream(bit).export_bitstream();
            download_bitstream(file.data, file.name);
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    return(
        <PaneGroup id="bitstreams" orientation="horizontal">
            <UIPanel id="main" key="bitstream_properties" level="level_2" default_size={72} min_size={30} collapsible={false}>
                <Toolbar>
                    <ToolbarButton label="Replace file" tooltip="Load another file in this bitstream, keeping its name" icon={<MdSwapHoriz size="1.5em"/>} enabled={bit !== undefined} onClick={handle_replace_file}/>
                    <ToolbarButton label="Export" tooltip="Download the file of the bitstream" icon={<MdDownload size="1.5em"/>} enabled={bit !== undefined} onClick={handle_export}/>
                </Toolbar>
                <div style={{flex: 1, minHeight: 0, overflowY: "auto"}}>
                    {bit === undefined
                        ? <div style={{padding: "1em", textAlign: "center", fontStyle: "italic", opacity: 0.6}}>Select a bitstream, or add one from the list</div>
                        : (
                            <Card>
                                <Name>{bit.name}</Name>
                                <Fact>
                                    <span>Version (SHA-256 of the file)</span>
                                    <div style={{display: "flex", alignItems: "flex-start", gap: "0.4em"}}>
                                        <Hash title={bit.hash}>{bit.hash !== undefined ? short_hash(bit) : "…"}</Hash>
                                        <MdContentCopy
                                            role="button"
                                            aria-label="Copy the hash"
                                            size="1.3em"
                                            color={ColorTheme.icons_color}
                                            title="Copy the whole hash" style={{cursor: "pointer", marginTop: "0.5em", opacity: bit.hash === undefined ? 0.3 : 1}}
                                            onClick={handle_copy_hash}
                                        />
                                    </div>
                                </Fact>
                                <Fact>
                                    <span>Loaded by</span>
                                    {users.length > 0
                                        ? <Chips>{users.map((application) => <Chip key={application.id}>{application.application_name}</Chip>)}</Chips>
                                        : <span style={{opacity: 0.6}}>No application loads this bitstream</span>
                                    }
                                </Fact>
                            </Card>
                        )
                    }
                </div>
            </UIPanel>
            <BitstreamSidebar selected={selected_id} on_select={set_selected_id}/>
        </PaneGroup>
    );

}

export default BitstreamManager;
