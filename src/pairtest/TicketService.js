import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  #totalAdults = 0;
  #totalInfants = 0;
  #totalChildren = 0;

  #MaxTickets = 20;

  #TicketRequestMap = [
    {
      name: "INFANT",
      price: 0,
      seat: 0,
    },
    {
      name: "CHILD",
      price: 10,
      seat: 1,
    },
    {
      name: "ADULT",
      price: 20,
      seat: 1,
    },
  ];

  #mapTicketRequest(request) {
    let mappedRequest;

    if (request.no > this.#MaxTickets)
      throw new InvalidPurchaseException(
        `Only ${this.#MaxTickets} tickets can be purchased at a time`
      );

    try {
      mappedRequest = this.#TicketRequestMap[request.type];
    } catch (e) {
      throw new InvalidPurchaseException(
        `An invalid ticket type was received, it mus be between 0...2`
      );
    }

    return {
      type: mappedRequest.name,
      price: mappedRequest.price * request.no,
      seat: request.no,
    };
  }

  #isRequestValid() {
    if (this.#totalAdults === 0)
      throw new InvalidPurchaseException(
        `Account doesn't have an adult listed, hence request is denied`
      );

    if (this.#totalAdults < this.#totalInfants)
      throw new InvalidPurchaseException(
        `Total Infants cannot be more than total adults`
      );
  }

  #validateAccountID(accountId) {
    if (Number.isNaN(accountId))
      throw new TypeError("Account ID must be a number");

    if (accountId < 1)
      throw new InvalidPurchaseException("Account ID cannot be less than 1");
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#validateAccountID(accountId);

    if (!Array.isArray(ticketTypeRequests))
      throw new TypeError("Ticket Type Requets must be an Array<object>");

    let totalAmount = 0;
    let totalSeat = 0;

    ticketTypeRequests.map((req) => {
      let ticket = new TicketTypeRequest(
        this.#TicketRequestMap[req.type]?.name,
        req.no
      );

      switch (ticket.getTicketType()) {
        default:
          break;

        case "ADULT":
          this.#totalAdults += req.no;
          break;

        case "INFANT":
          this.#totalInfants += req.no;
          break;

        case "CHILD":
          this.#totalChildren += req.no;
          break;
      }

      req = this.#mapTicketRequest(req);

      totalAmount += req.price;
      totalSeat += req.seat;
    });

    this.#isRequestValid();

    new TicketPaymentService().makePayment(accountId, totalAmount);

    new SeatReservationService().reserveSeat(accountId, totalSeat);

    console.log("Total Amount in GBP:", totalAmount);
    console.log("Total Seats Booked:", totalSeat);
    console.log("Total Adults:", this.#totalAdults);
    console.log("Total Children:", this.#totalChildren);
    console.log("Total Infants:", this.#totalInfants);
  }
}
