export declare const endpoints: {
    mediator: EndPoint<{}>;
    join: EndPoint<{}>;
    audit: EndPoint<{
        address: string;
        asset: string;
        round?: number | undefined;
    }>;
    proof: EndPoint<{
        address: string;
        asset: string;
    }>;
    fetchOrderBook: EndPoint<{
        symbol: string;
    }>;
    fetchTrades: EndPoint<{
        symbol: string;
    }>;
    fetchBalances: EndPoint<{
        address: string;
    }>;
    createOrder: EndPoint<{}>;
    fetchOrder: EndPoint<{
        id: string;
    }>;
    fetchOrders: EndPoint<{
        owner: string;
    }>;
    fastWithdrawal: EndPoint<{}>;
};
declare type PathBuilder<T> = (params?: T) => string;
interface EndPoint<T> {
    path: string;
    toPath: PathBuilder<T>;
}
export {};
