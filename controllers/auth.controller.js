import User from "../models/user.schema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"


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

