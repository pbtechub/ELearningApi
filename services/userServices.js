import CatchAssyncError from "../middleware/catchAssyncError.js";
import userModel from "../models/userModel.js";



export const getUserId = CatchAssyncError(async (id, res) => {

    
       const user =  await userModel.findById(id);

       res.status(201).json({
        success: true,
        user
        
       })

  
})