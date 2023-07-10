
const { User } = require("../model/User");


exports.fetchUserById = async (req,res)=>{
    const {id}= req.user;
    try{
    const user = await User.findById(id,'name email id addresses role').exec();
        res.status(200).json({id:user.id,addresses:user.addresses,email:user.email,role:user.role});
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.updateUser = async (req, res) => {
    //this product we have to get from the API body
    console.log("inside update user")
    const {id} = req.params;
    
    try {
      const user = await User.findByIdAndUpdate(id,req.body,{new:true})
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  };
