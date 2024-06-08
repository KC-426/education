const sendToken = async (user, statusCode, res) => {
    const token = await user.getJWTToken();
  
    const option = {
      maxAge: new Date(
        new Date(Date.now() + process.env.TEACHER_COOKIE_EXPIRE * 1000 * 60)
      ),
      sameSite: "none",
      secure: true,
      crossDomain: true,
    };
  
    res.cookie("JWT_TEACHER_token", token, option);
    res.status(statusCode).json({
      success: true,
      teacher: user,
      token,
    });
  };
  
  export default sendToken;