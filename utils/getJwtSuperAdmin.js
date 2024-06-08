const superAdmin = async (user, statusCode, res) => {
    const token = await user.getJWTToken();
  
    console.log(process.env.ADMIN_COOKIE_EXPIRE);
  
    const option = {
      maxAge: new Date(
        new Date(Date.now() + process.env.ADMIN_COOKIE_EXPIRE * 1000 * 60)
      ),
      sameSite: "none",
      secure: true,
      crossDomain: true,
    };
  
    res.cookie("jwt_su_adm_token", token, option);
    res.status(statusCode).json({
      success: true,
      user,
      token,
    });
  };
  
  export default superAdmin;