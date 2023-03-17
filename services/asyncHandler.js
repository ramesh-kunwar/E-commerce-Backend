
// the goal of this function is to handle anything in asynchronous way. (even though the funciton may be synchronous or asynchronous)
const asyncHandler = (fn) => async (req, res, next) => { // we are taking function as input (function inside another function)  input for async ()=>{} is (fn)

    try {
        await fn(req, res, next) // refer to hitesh chaudhory youtube closure video
    } catch (error) {

        res.status(err.code || 500).json({
            success: false,
            message: error.message,
        })
    }


}
export default asyncHandler;



/**
 * 
 * STEPS
 * const asynchhandler = () =>{}
 * 
 * const asyncHandler = (func) =>{}
 * 
 * const asyncHandler = (func) => () => {};
 * 
 * const asyncHandler = (func) => async () => {}
 * 
 */


/**
 *  USING PLAIN FUNCTION
 * 
 *  function asynchandler (fn){
 *      return async function (req, res, next) {
 *          try{
 *          
 *              await fn(req, res, next);
 * 
 *          }catch (err) {
 *              res.status(err.code || 500).json({
 *                  success: false
 *              })
 *          }
 *      }
 * }
 * 
 */