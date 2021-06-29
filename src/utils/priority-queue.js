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

    swap(item, oldPriority, newPriority) {
        if (!this.elements.hasOwnProperty(oldPriority)) {
            return;
        }
        const swapIndex = this.getIndex(item, oldPriority);

        if (swapIndex > -1) {
            this.elements[oldPriority].splice(swapIndex, 1);
            this.put(item, newPriority);

            if (this.elements[oldPriority].length === 0) {
                delete this.elements[oldPriority];
                if (oldPriority === this.minKey) {
                    this.minKey = this.min();
                }
            }
        }
    }

    remove(item, priority) {
        if (!this.elements.hasOwnProperty(priority)) {
            return;
        }
        const removeIndex = this.getIndex(item, priority);

        if (removeIndex > -1) {
            this.elements[priority].splice(removeIndex, 1);

            if (this.elements[priority].length === 0) {
                delete this.elements[priority];
                if (priority === this.minKey) {
                    this.minKey = this.min();
                }
            }
        }
    }

    getIndex(item, priority) {
        return this.elements[priority].findIndex(i => {
            for (const [key, val] of Object.entries(i)) {
                if (i[key] != item[key]) {
                    return false;
                }
            }
            return true;
        });
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

if (typeof module != 'undefined') {
    module.exports= {
        PriorityQueue
    };
}