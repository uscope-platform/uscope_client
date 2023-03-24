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


import { sign_in} from "../../../src/client_core";




test("auth_sucess", () => {
    return sign_in({user:"test", password:"success"}).then((resp) =>{
        expect(resp).toBe("ok");
    })
})

let alert_message = "";
test("auth_fail", () => {
    jest.spyOn(window, 'alert').mockImplementation((msg) => {alert_message = msg;});

    return sign_in({user:"test", password:"fail"}).catch((err) =>{
        expect(err.response.data).toBe("FAILED");
        expect(err.response.status).toBe(401);
        expect(alert_message).toBe("login failed");
    })
})
