class webelement{
	//todo try to use class name in the constructor and modify the code
	constructor(){
		this.elementtype= null;
		this.elementxpath= null;
		this.elementaction= null;
		this.elementvalue= null;

	}

	get elementType(){
		return this.elementtype;
	}

	set elementType(value){
		this.elementtype= value;
	}
	
	get elementXpath(){
		return this.elementxpath;
	}

	set elementXpath(elementxpath){
		this.elementxpath=elementxpath;
	}

	get elementAction(){
		return this.elementaction;
	}

	set elementAction(elementaction){
		this.elementaction = elementaction;
	}

	get elementValue(){
		return this.elementvalue;
	}

	set elementValue(elementvalue){
		this.elementvalue=elementvalue;
	}

	toString(){
		return "Type = " + this.elementType + ", " +
			   "Xpath = " + this.elementXpath + ", " +
			   "Action = " + this.elementAction + ", " +
			   "Value = " + this.elementValue + 
			   "\n";
	}

    getClass() {

        return this.constructor;

    }

}