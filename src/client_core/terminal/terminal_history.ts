// Copyright 2026 Filippo Savi
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

const STORAGE_KEY = "uscope_terminal_history";
const MAX_ENTRIES = 200;

const default_storage = (): Storage | null => {
    try {
        return window.localStorage;
    } catch (e) {
        // storage can be unavailable (private windows, blocked site data), the history then lasts for the session
        return null;
    }
};

/// Commands entered in the terminal, most recent last. Remembered by the browser, navigated with the arrow keys
export class command_history {
    private entries: string[] = [];
    // index of the entry being shown, entries.length when the line being edited is shown
    private position = 0;
    // the line that was being edited when the navigation started
    private draft = "";

    constructor(private readonly storage: Storage | null = default_storage()) {
        try {
            const stored = JSON.parse(this.storage?.getItem(STORAGE_KEY) ?? "[]");
            if (Array.isArray(stored)) {
                this.entries = stored.filter((item): item is string => typeof item === "string").slice(-MAX_ENTRIES);
            }
        } catch (e) {
            this.entries = [];
        }
        this.position = this.entries.length;
    }

    add(line: string) {
        if (line.trim() === "") return;
        if (this.entries[this.entries.length - 1] !== line) {
            this.entries.push(line);
            if (this.entries.length > MAX_ENTRIES) this.entries.splice(0, this.entries.length - MAX_ENTRIES);
            this.save();
        }
        this.reset_navigation();
    }

    /// Moves to the previous (older) entry, null when there is none. `current` is the line being edited, it is
    /// restored by `next` once the newest entry is passed
    previous(current: string): string | null {
        if (this.position === 0) return null;
        if (this.position === this.entries.length) this.draft = current;
        this.position--;
        return this.entries[this.position] ?? null;
    }

    next(): string | null {
        if (this.position >= this.entries.length) return null;
        this.position++;
        return this.position === this.entries.length ? this.draft : this.entries[this.position] ?? null;
    }

    reset_navigation() {
        this.position = this.entries.length;
        this.draft = "";
    }

    list(): readonly string[] {
        return this.entries;
    }

    clear() {
        this.entries = [];
        this.reset_navigation();
        this.save();
    }

    private save() {
        try {
            this.storage?.setItem(STORAGE_KEY, JSON.stringify(this.entries));
        } catch (e) {
            // the history just is not remembered
        }
    }
}

// the one of the terminal, also read by the history command
export const history = new command_history();
