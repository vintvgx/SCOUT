// utils/throttleRequest.ts
class RequestThrottle {
  private requestsQueue: (() => Promise<void>)[] = [];
  private maxRequestsPerInterval: number;
  private interval: number;
  private isThrottling: boolean = false;

  constructor(maxRequestsPerInterval: number = 5, interval: number = 1000) {
    this.maxRequestsPerInterval = maxRequestsPerInterval;
    this.interval = interval;
  }

  addToQueue = (fn: () => Promise<void>) => {
    this.requestsQueue.push(fn);
    this.processQueue();
  };

  processQueue = () => {
    if (this.isThrottling) return;
    this.isThrottling = true;

    const requests = this.requestsQueue.splice(0, this.maxRequestsPerInterval);
    Promise.all(requests.map((fn) => fn())).then(() => {
      setTimeout(() => {
        this.isThrottling = false;
        if (this.requestsQueue.length > 0) this.processQueue();
      }, this.interval);
    });
  };
}

// Export an instance of RequestThrottle
export const requestThrottle = new RequestThrottle();
