
class elementstack { 
  
    // Array is used to implement stack 
    constructor() 
    { 
        this.elements = []; 
    } 
  
    push(element){
        this.elements.push(element);
    } 
    
    pop(){
        if(this.elements.length==0){
            return null;
        }
        return this.elements.pop();
    } 
    peek(){
        if(this.elements.length==0){
            return null;
        }
        return this.elements[this.elements.length-1];
    } 
    isEmpty(){
        return this.elements.length==0;
    } 

    getAllElements(){
      return this.elements;  
    }
    printStack(){
        var printStr = ""; 
        for (var i = 0; i < this.elements.length; i++){ 
            printStr += this.elements[i].toString(); 
        }
        return printStr; 
    }
} 