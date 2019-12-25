const { fetchBids, fetchCancellations } = require("./Router/transactions");

const { rollback } = require("./Router/rollback");

// consume bids produced by trade service
fetchBids();

// consume cancellation consumed by trade service
fetchCancellations();

// check for stale bids every 10 minutes
setInterval(rollback, 600000);
