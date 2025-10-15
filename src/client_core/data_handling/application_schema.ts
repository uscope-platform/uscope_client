export let application_schema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Application Definition",
  "description": "JSON object defining an application in the uPlatform suite",
  "type": "object",
  "properties": {
    "application_name": {
      "description": "Name of the application",
      "type": "string"
    },
    "bitstream": {
      "description": "Name of the bitstream file for this application",
      "type": "string"
    },
    "channel_groups": {
      "description": "Array of objects that describe a channel group",
      "type": "array",
      "items": {}
    },
    "channels": {
      "description": "Array of channels that describe a data channel",
      "type": "array",
      "items": {}
    },
    "pl_clocks":{
      "description": "Object containing the frequency of each PS-PL clock signal",
      "type": "object",
      "properties": {
        "0":{
          "type": "integer",
          "description": "frequency of PS-PL clock 0"
        },
        "1":{
          "type": "integer",
          "description": "frequency of PS-PL clock 1"
        },
        "2":{
          "type": "integer",
          "description": "frequency of PS-PL clock 2"
        },
        "3":{
          "type": "integer",
          "description": "frequency of PS-PL clock 3"
        }
      },
      "additionalProperties": false,
      "minProperties": 4
    },
    "initial_registers_values": {
      "description": "array of objects that specify values to be written to specific registers upon FPGA loading",
      "type": "array",
      "items": {}
    },
    "macro": {
      "description": "Array of user defined macros",
      "type": "array",
      "items": {}
    },
    "parameters": {
      "description": "Array of user defined parameters",
      "type": "array",
      "items": {}
    },
    "peripherals": {
      "description": "Array of channels that describe a peripheral",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "base_address": {
            "description": "Base address of the peripheral, from which all other registers are located",
            "type": "string"
          },
          "name": {
            "description": "User friendly name of the peripheral",
            "type": "string"
          },
          "peripheral_id": {
            "description": "Unique ID that identifies the peripheral in the application",
            "type": "string"
          },
          "proxied": {
            "description": "True if the peripheral is only accessible through some bridge peripheral and not from the main bus",
            "type": "boolean"
          },
          "proxy_address": {
            "description": "Base address of the proxy peripheral",
            "type": "string"
          },
          "spec_id": {
            "description": "ID that links this peripheral to the relative specification",
            "type": "integer"
          }
        },
        "required": [
          "base_address",
          "name",
          "peripheral_id",
          "proxied",
          "spec_id"
        ],
        "if": {
          "properties": {
            "proxied": {
              "enum": [
                true
              ]
            }
          }
        },
        "then": {
          "required": [
            "proxy_address"
          ]
        },
        "else":true
      }
    }
  },
  "required": [
    "application_name",
    "bitstream",
    "channel_groups",
    "channels",
    "initial_registers_values",
    "macro",
    "parameters",
    "peripherals"
  ]
} as const;