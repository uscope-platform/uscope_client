export let peripheral_schema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "peripherals":{
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "name": {
            "type": "string"
          },
          "parametric": {
            "type": "boolean"
          },
          "registers": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "ID": {
                  "type": "string"
                },
                "description": {
                  "type": "string"
                },
                "direction": {
                  "type": "string"
                },
                "fields": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "description": {
                        "type": "string"
                      },
                      "length": {
                        "type": "integer"
                      },
                      "name": {
                        "type": "string"
                      },
                      "offset": {
                        "type": "integer"
                      },
                      "order": {
                        "type": "integer"
                      },
                      "n_fields": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        }
                      }
                    },
                    "required": [
                      "description",
                      "length",
                      "name",
                      "offset"
                    ]
                  }
                },
                "n_registers": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "offset": {
                  "type": "string"
                },
                "register_format": {
                  "type": "string"
                },
                "register_name": {
                  "type": "string"
                },
                "order": {
                  "type": "number"
                }
              },
              "anyOf": [
                {
                  "required": [
                    "ID",
                    "description",
                    "direction",
                    "offset",
                    "register_name"
                  ]
                },
                {
                  "required": [
                    "ID",
                    "description",
                    "direction",
                    "order",
                    "n_registers",
                    "register_name"
                  ]
                }
              ]
            }
          },
          "version": {
            "type": "string"
          }
        },
        "additionalProperties": false,
        "required": [
          "id",
          "name",
          "parametric",
          "registers",
          "version"
        ]
      }
    }
  }
}
