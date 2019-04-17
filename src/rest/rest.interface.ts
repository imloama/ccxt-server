
export declare interface Order {
  symbol: string;
  // market limit
  type: string;
  // buy sell
  side: string;
  amount: number;
  price: number;
}