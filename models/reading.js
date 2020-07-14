var Validator = require('jsonschema').Validator;
var v = new Validator();

const schema = {
    id: "/SimplePerson",
    type: "object",
    properties: {
        sensorId: {"type": "string"},
        value: {"type": "number"},
        time: {"type": "number", "minimum": 1} //This should be some timestamp
    }
};

const validateReading = r => v.validate(r, schema);

module.exports = { validateReading };
