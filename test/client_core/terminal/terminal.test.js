// Copyright 2021 Filippo Savi
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

import {
    complete_command,
    current_line,
    prefix,
    init_test_terminal, set_current_line, terminal, execute_command, handle_keypress
} from "../../../src/client_core/terminal/terminal";
import {
    terminal_backend
} from "../../../src/client_core/terminal/terminal_backend";



test("prefix_extraction", () => {
    expect(prefix(["write", "write_direct"])).toBe("write");
    expect(prefix(["write", "test"])).toBe("");
})

test("complete_command", ()=>{
    init_test_terminal();
    //No ambiguity
    set_current_line("re");
    complete_command();
    expect(current_line).toBe("read");
    expect(terminal._test_get_content()).toStrictEqual(["\r\n$ ", "read"]);
    terminal._test_clear_buffer();
    // Ambiguous command 2 choices
    set_current_line("wr");
    complete_command();
    expect(current_line).toBe("write");
    expect(terminal._test_get_content()).toStrictEqual(["\r\n\u001b[34mwrite   write_direct\u001b[37m", "\r\n$ ", "write"]);
    terminal._test_clear_buffer();
    // Ambiguous command 1 match
    set_current_line("write");
    complete_command();
    expect(current_line).toBe("write");
    expect(terminal._test_get_content()).toStrictEqual(["\r\n\u001b[34mwrite   write_direct\u001b[37m", "\r\n$ ", "write"]);
    terminal._test_clear_buffer();
    // Ambiguous command 1 choices
    set_current_line("write_");
    complete_command();
    expect(current_line).toBe("write_direct");
    expect(terminal._test_get_content()).toStrictEqual(["\r\n$ ", "write_direct"]);
})

test("test_execute_commands", ()=>{
    init_test_terminal();
    terminal._test_clear_buffer();
    set_current_line("wrong_test");
    execute_command("wrong_test")
    expect(terminal._test_get_content()).toStrictEqual(['\r\n\x1b[1;31mUnrecognized command: wrong_test\x1b[37m']);

    const read_spy = jest.spyOn(terminal_backend, "read");
    const write_spy = jest.spyOn(terminal_backend, "write");
    const write_direct_spy = jest.spyOn(terminal_backend, "write_direct");
    const execute_spy = jest.spyOn(terminal_backend, "execute_queue");
    const clear_spy = jest.spyOn(terminal_backend, "clear_queue");

    execute_command("read --help")
    execute_command("write --help")
    execute_command("write_direct --help")
    execute_command("execute_queue --help")
    execute_command("clear_queue --help")


    expect(read_spy).toHaveBeenCalledTimes(1);
    expect(write_spy).toHaveBeenCalledTimes(1);
    expect(write_direct_spy).toHaveBeenCalledTimes(1);
    expect(execute_spy).toHaveBeenCalledTimes(1);
    expect(clear_spy).toHaveBeenCalledTimes(1);
})


test("test_regular_key", ()=>{
    init_test_terminal();
    set_current_line("");
    terminal._test_clear_buffer();
    handle_keypress("r");
    expect(current_line).toBe("r");
    expect(terminal._test_get_content()).toStrictEqual(["r"]);
})

test("test_delete_key", ()=>{
    init_test_terminal();
    terminal._test_clear_buffer();
    set_current_line("");
    handle_keypress("r");
    handle_keypress("e");
    handle_keypress("");
    expect(current_line).toBe("r");
    expect(terminal._test_get_content()).toStrictEqual(["r", "e", "\b \b"]);
})

test("test_delete_key", ()=>{
    init_test_terminal();
    terminal._test_clear_buffer();
    set_current_line("");
    handle_keypress("r");
    handle_keypress("e");
    handle_keypress("");
    expect(current_line).toBe("r");
    expect(terminal._test_get_content()).toStrictEqual(["r", "e", "\b \b"]);
})


test("test_return_key", ()=>{
    init_test_terminal();
    terminal._test_clear_buffer();
    const write_spy = jest.spyOn(terminal_backend, "write");
    set_current_line("write --help");

    handle_keypress("\r")
    expect(write_spy).toHaveBeenCalledTimes(1);
    expect(current_line).toBe("");
    expect(terminal._test_get_content()).toStrictEqual(
        [
            "\r\n\u001b[32mWRITE:\u001b[37m",
            "\r\n\u001b[32mThis command adds a write request to the queue for batch execution\u001b[37m",
            "\r\n\u001b[32mNOTE: When accessing single fields the whole register gets written anyway\u001b[37m",
            "\r\n\u001b[32mthe default value for non accessed fields is 0\u001b[37m",
            "\r\n\u001b[32mformat: write [REGISTER/FIELD] [VALUE]\u001b[37m",
            "\r\n$ "
        ]
    );
})


test("test_tab_key", ()=>{
    init_test_terminal();
    terminal._test_clear_buffer();
    set_current_line("re");

    handle_keypress("\t")
    expect(current_line).toBe("read");
    expect(terminal._test_get_content()).toStrictEqual(["\r\n$ ","read"]);
})