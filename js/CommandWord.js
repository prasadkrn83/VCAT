class CommandWord {
    constructor(value,type) {
        this.value = value;
        this.type = type;
        this.next = null;
    }

    next(){
        return this.next;
    }

    getType(){
        return this.type;
    }

    getValue(){
        return this.value;
    }
}