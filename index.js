import TicketService from "./src/pairtest/TicketService.js";

//scenario 1
console.log("--- Scenario 1 ---");
new TicketService().purchaseTickets(
  1,
  { type: 0, no: 2 },
  { type: 1, no: 1 },
  { type: 2, no: 2 },
  { type: 2, no: 2 }
);

// console.log("--- Scenario 2 ---");
// console.log("-- Exceeding maximum ticket at a time");
// new TicketService().purchaseTickets(
//   1,
//   { type: 0, no: 2 },
//   { type: 1, no: 1 },
//   { type: 2, no: 2 },
//   { type: 2, no: 2 },
//   { type: 2, no: 21 }
// );

// console.log("--- Scenario 3 ---");
// console.log("-- Too much infants");
// new TicketService().purchaseTickets(
//   1,
//   { type: 0, no: 18 },
//   { type: 1, no: 1 },
//   { type: 2, no: 2 },
//   { type: 2, no: 2 }
// );

// console.log("--- Scenario 4 ---");
// console.log("-- No Adult in request");
// new TicketService().purchaseTickets(1, { type: 1, no: 1 });
