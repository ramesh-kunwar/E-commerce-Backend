import User from "../models/user.schema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import mailHelper from "../utils/mailHelper"
import crypto from "crypto"

export const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,

    // could be in a separate file in utils
}

/*************************************************************************
    @SIGNUP
    @route http://localhost:4000/api/auth/signup
    @description User signup controller for creating a new user
    @parameters name, email, password
    @return User Object
************************************************************************/

export const signUp = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new CustomError("Please fill all fields", 400)
    }

    // check if user exists
    const existinguser = await User.findOne({ email })

    if (existinguser) {
        throw new CustomError("User already exists", 400)
    }

    //
    const user = await User.create({
        name: name,
        email,
        password
    })
    const token = user.getJwtToken() // because token is in user.schema method

    console.log(user)
    user.password = undefined

    res.cookie("token", token, cookieOptions)

    res.status(200).json({
        success: true,
        token,
        user
    })

})



/*************************************************************************
    @LOGIN
    @route http://localhost:4000/api/auth/login
    @description User login controller for login the user
    @parameters  email, password
    @return User Object
************************************************************************/

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new CustomError("Please fill all fields", 400)
    }

    const user = User.findOne({ email }).select("+password") // we have made password select false in user.schema now we are making it true

    if (!user) {
        throw new CustomError("Invalid credentials", 400)

    }

    // compare the password

    const isPasswordMatched = await user.comparePassword(password)

    // if password match send the token
    if (isPasswordMatched) {
        const token = user.getJwtToken()
        user.password = undefined
        res.cookie("token", token, cookieOptions) //  token as a cookie // name of the cookie is token
        return res.status(200).json({
            success: true,
            token,
            user,
        })
    }
    // if password doesnt match
    throw new CustomError("Invalid credentials - pass", 400)

})



/*************************************************************************
    @LOGOUT
    @route http://localhost:4000/api/auth/logout
    @description User logout controller by clearing user cookies
    @parameters  
    @return success message
************************************************************************/

export const logout = asyncHandler(async (_req, res) => { // we are not using req so we use _req _ means not using (not compulsory)
    // res.clearCookie()
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})



/*************************************************************************
    @FORGOT_PASSWORD
    @route http://localhost:4000/api/auth/password/forgot
    @description User will submit email and we will generate a token
    @parameters  email
    @return success message - email send
************************************************************************/


export const forgotPassword = asyncHandler(async (req, res) => {
    // step 1: grab the email
    const { email } = req.body;

    // step 2: search the user in the database.
    // check email for null or "" (assignment)
    const user = await User.findOne({ email })

    if (!user) {
        throw new CustomError("User not found", 404)
    }

    //  generate reset token
    const resetToken = user.generateForgotPasswordToken()


    // save to db
    await user.save({ validateBeforeSave: false }) // user.save() needs all the fields which are required: true in model, so to avoid that we validateBeforeSave: false


    // send email to the user - url to forgot Password //later on when resetting the password, grab the url from user's token

    const resetUrl =
        `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`

    const text = `Your password reset url is \n\n${resetUrl} \n\n`

    try {
        await mailHelper({
            email: user.email,
            subject: "Password reset email for website",
            text: text
        })
        res.status(200).json({
            success: true,
            message: `Email send to ${user.emamil}`
        })
    } catch (error) {
        // roll back - clear fields and save
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined

        await user.save({ validateBeforeSave: false })
        throw new CustomError(error.message || "Email sent failure", 500)
    }

})


/*************************************************************************
    @RESET_PASSWORD
    @route http://localhost:4000/api/auth/password/reset/:resetPasswordToken
    @description User will able to reset password based on url token
    @parameters  token from url, password, confirm password
    @return User object
************************************************************************/

export const resetPassword = asyncHandler(async (req, res) => {
    const { token: resetToken } = req.params
    const { password, confirmPassword } = req.body;

    // in user schema we have encrypted the token, so we need to again encrypt the password and check
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hext")

    // find user based on forgotPasswordToken
    const user = await User.findOne({ forgotPasswordToken: resetPasswordToken, forgotPasswordExpiry: { $gt: Date.now() } })

    if (!user) {
        throw new CustomError("password token is invalid or expired", 400)
    }

    if (password !== confirmPassword) {
        throw new CustomError("password and confirm password doesn't match", 400)

    }
    user.password = password
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined

    await user.save()

    // create token and send as response
    const token = user.getJwtToken()
    user.password = undefined;

    // helper method for cookie can be added
    res.cookie("token", token, cookieOptions)

    res.status(200).json({
        success: true,
        user
    })
})


// TODO: create a controller for change password