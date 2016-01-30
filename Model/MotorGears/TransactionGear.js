
var TransactionBehavior = {

    commitTransaction(t) {

        try {

            t.commit();

            return true;

        } catch (e) {

            console.error(e);
            
            t.rollback();

            return false;

        }

    }


};



module.exports = TransactionBehavior;