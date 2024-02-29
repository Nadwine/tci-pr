/*=====================================================*
 *
 *        This file is to test quick little pieces of code
 *        to see how it behaves.
 *
 *=====================================================*/

// Delete your code below when done
const stripe = require("stripe")("sk_test_51OYZbBIGvo7mWPbtFcewnwMjiylTPjrPygn74hDT6TqjcKOtm1X3Uxou0vWlGsjaG4YN1wh4DUYTbWr37Lvw16hm00VxcoJANw");

// stripe.accounts.del('')
stripe.accounts.del("acct_1OoEvuII4STNB2wI");
