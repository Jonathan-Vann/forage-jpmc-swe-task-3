import { ServerRespond } from './DataStreamer';

/**
 * Match schema in Graph.tsx => 'ComponentDidMount()'
 * Determines structure of the object (row)
 */
export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    /**
     * serverRespond returns: {dict }
     */
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    // assume threshold for trading opportunity to be when average ratio
    // is +/-10% of the historical average
    const upperBound = 1 + 0.10;
    const lowerBound = 1 - 0.10;
    // return a datapoint in the proper format for Graph.tsx
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      // if timestamp for stockABC > timestamp for stockDEF, return timestamp for stockABC
      // else, return timestamp for stockDEF
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ? 
        serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      // if stockABC/stockDEF > 1+0.10 OR stockABC/stockDEF < 1-0.10, return stockABC/stockDEF
      // else, return undefined
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio: undefined,
    };
  }
  }
