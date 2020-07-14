//move db to a class that does promise/based
//
const initialDb = {
    sensorReadings: [],
    thresholds: {}
}

let db = {...initialDb};

const reset = () => {
    db = {...initialDb};
};

module.exports = {
    db,
    reset
};

