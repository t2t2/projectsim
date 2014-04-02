define(function (require) {
	function InputException (type, message, data) {
		this.type = type;
		this.message = message;
		this.data = data;
		this.toString = function() {
			
		};
	};
	
	InputException.prototype.toString = function(first_argument) {
		return this.type + this.message;
	};

	return InputException;
})