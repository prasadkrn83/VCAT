class Command{
	constructor(){
		this.head=null;
		this.size=0;
	}

	addCommandWord(value,type){
		var word = new CommandWord(value,type);

		var temp;

		if(this.head==null){
			this.head=word;
		} else{
			var current = this.head; 
	  
	        // iterate to the end of the 
	        // list 
	        while (current.next) { 
	            current = current.next; 
	        } 
	         // add the new word to the end of the list 
       		 current.next = word; 
		}

		this.size++;
	}

	elementAt(index){
		var i=0;
		if(index<0 || index >this.size){
			return null;
		}else{
			var current= this.head;
			while(i<index){
				current=current.next;
				i++;
			}
			return current;
		}

	}

	isEmpty(){
		return this.size==0;
	}

	size_of_command(){
		return this.size;
	}

	printList() 
	{ 
 		var curr = this.head; 
       	var str = ""; 
    	while (curr) { 
        	str += curr.element + " "; 
        	curr = curr.next; 
    	} 
    	return str; 
	}
}