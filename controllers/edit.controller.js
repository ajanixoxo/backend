import { User } from "../models/user.models.js";
import { Agent } from "../models/agent.models.js";


export const editUsersProfile = async(req, res) => {
    const {formData } = req.body
    const {id, name , phone} = formData

    // console.log("Form  backednd ", id, name, phone)
    if(!id){
        return res.status(400).json({
            success:false,
            message:"No users found. try logging in again"
        })
    }
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }
          console.log(" Users: ", user)
          if(user){
            user.name = name
            user.phoneNumber = phone
          }
          await user.save();
        console.log("newly updated: ", user)
        res.status(201).json({
            success: true,
            message: "User details Updated Successfully",
            user: {
                ...user.doc,
                password: undefined

            }
        })
      
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
        
    }
}
export const editAgentsProfile = async(req, res) => {
    const {formData } = req.body
    const {id, name , phone, areaLocations, state, touringFee} = formData

    //  console.log("Form  backednd ", id, name , phone, areaLocations, state, touringFee)
    if(!id){
        return res.status(400).json({
            success:false,
            message:"No Agent found. try logging in again"
        })
    }
    try {
        const agent = await Agent.findById(id)
        if (!agent) {
            return res.status(404).json({
              success: false,
              message: "Agent not found",
            });
          }
          console.log(" Agent: ", agent)
          if(agent){
            agent.name = name
            agent.phoneNumber = phone
            agent.area = areaLocations
            agent.state = state
            agent.touringFee = touringFee;
          }
          await agent.save();
        console.log("newly updated: ", agent)
        res.status(201).json({
            success: true,
            message: "Agent details Updated Successfully",
            agent: {
                ...agent.doc,
                password: undefined

            }
        })
      
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
        
    }
}