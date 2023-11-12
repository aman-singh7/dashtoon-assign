class Queue<T> {
  private queue: T[];

  constructor() {
    this.queue = [];
  }

  enqueue = (data: T) => {
    this.queue.push(data);
  };

  // Returns Undefined if array is empty
  deueue = () => {
    return this.queue.shift();
  };

  isEmpty = () => {
    return this.queue.length === 0;
  };

  clear = () => {
    this.queue = [];
  };
}

export default Queue;
