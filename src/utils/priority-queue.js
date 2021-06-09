class PriorityQueue {
    constructor() {
        this.elements = {};
        this.minKey = Infinity;
    }
    
    empty() {
        return Object.keys(this.elements).length === 0;
    }

    put(item, priority) {
        let array = [];

        if (!this.elements.hasOwnProperty(priority)) {
            this.elements[priority] = array;
        }
        
        array.push(item);

        if (priority < this.minKey) {
            this.minKey = priority;
        }
    }

    getFront() {
        let front = this.elements[this.minKey].shift();
        if (this.elements[this.minKey].length === 0) {
            delete this.elements[this.minKey];
            this.minKey = this.min();
        }

        return front;
    }

    min() {
        if (this.empty()) {
            return Infinity;
        }
        const keys = Object.keys(this.elements);
        let minKey = keys[0];

        for (const key of keys) {
            if (key < minKey) {
                minKey = key;
            }
        }

        return minKey;
    }
}