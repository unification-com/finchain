var ether = require('./ethereum.js');

let args = process.argv.slice(2);
let threshold = args[0];

function setNewThreshold(_threshold){
    ether.setThreshold(_threshold);
};

async function updateThreshold(_threshold) {
    console.log("Sending...");
    await setNewThreshold(_threshold);
}

if(threshold === undefined || threshold === null) {
    console.log("Threshold not defined. Run:")
    console.log("node src/threshold.js [NEW_THRESHOLD]");
    process.exit(1);
}

if(threshold > 0) {
    updateThreshold(threshold);
} else {
    console.log("threshold much be > 0");
    process.exit(1);
}
