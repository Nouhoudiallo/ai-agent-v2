/* eslint-disable @typescript-eslint/no-unused-vars */
import {withPrisma} from "../methode/withPrisma"
export const handleUpdateUser = withPrisma(
  async (req, res, prisma) =>{
    res.status(200).json({
      message: "Update user route is not implemented yet.",
    });
  }
)