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


import axios from "axios";
import {toast} from "react-toastify";

/// A failed request to the server, with the message the server gave
export class backend_error extends Error {
    public status: number | undefined;
    constructor(message: string, status?: number) {
        super(message);
        this.name = "backend_error";
        this.status = status;
    }
}

/// The server answers its failures with {message}, a plain text is also taken
const server_message = (data: unknown): string | undefined => {
    if(typeof data === "string" && data.trim() !== "") return data;
    if(data !== null && typeof data === "object" && typeof (data as any).message === "string" && (data as any).message !== ""){
        return (data as any).message;
    }
    return undefined;
};

/// The error to reject with for something that went wrong while talking to the server
export const to_backend_error = (error: unknown): unknown => {
    if(!axios.isAxiosError(error)) return error;
    if(error.response === undefined) return new backend_error("The server could not be reached", undefined);
    const status = error.response.status;
    return new backend_error(server_message(error.response.data) ?? "The server answered with an error (" + status + ")", status);
};

/// What to show of anything that was thrown or rejected
export const error_text = (error: unknown): string => {
    if(typeof error === "string") return error;
    if(error instanceof Error && error.message !== "") return error.message;
    if(Array.isArray(error)) return error.map(error_text).join("\n");
    return "Unknown error";
};

/// Shows the error to the user
export const report_error = (error: unknown, context?: string) => {
    console.error(error);
    const text = error_text(error);
    toast.error(context === undefined ? text : context + ": " + text);
};
