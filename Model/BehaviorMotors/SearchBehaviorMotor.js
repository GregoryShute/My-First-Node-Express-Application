var SearchBehaviorMotor = {

    sanitize(query) {

        var query_length = query.length;

        for (var i = 0, len = query_length; i < len; i += 1) {

            if (!SearchBehaviorMotor.isQueryCharValid(query.charCodeAt(i))) {

                return false;

            }

        }
        
        return true;
        
    },

    isQueryCharValid(char_code) {

        if ((char_code > 96 && char_code < 123) || (char_code > 64 && char_code < 91)) {
            
            return true;

        } else {

            return false;

        }

    }

};

module.exports = SearchBehaviorMotor;