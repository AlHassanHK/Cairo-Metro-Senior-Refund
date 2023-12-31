import { PrismaClient } from "@prisma/client";
import axios from "axios";
//Database enums, user RideStatus.pending for example
import { UserRole } from "@prisma/client";
import { RouteId } from "@prisma/client";
import { RefundRequestStatus, SeniorRequestStatus } from "@prisma/client";

const prisma = new PrismaClient();

const seniorRequests = prisma.SeniorRequest;

const getAllSeniorRequests = async (req, res) => {
  try {
    const allSeniorRequests = await seniorRequests.findMany({});
    res.status(200).json(allSeniorRequests);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


const approveSeniorRequest = async (req, res) => {
  try {
    const{ id,nationalId} = req.body;
    nId=nationalId.toString();
    const updated = await seniorRequests.update({
      where: {
        id: id
      },
      data: {
        status: nId.charAt(0) > 2 || nId.substring(1, 3) > 63? SeniorRequestStatus.Rejected:SeniorRequestStatus.Approved,
        reviewedBy: req.body.reviewedBy,
      }
    })
    console.log(updated.userId);
    await axios.patch("https://metro-user.vercel.app/api/user/", { "id": updated.userId, "isSenior": true });
    res.status(200).json({
      status: `Successfully approved : ${id}`,
      newDocument: updated
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }

}
// const rejectSeniorRequest = async (req, res) => {
//   try {
//     const id = req.body.id;
//     const updated = await seniorRequests.update({
//       where: {
//         id: id
//       },
//       data: {
//         status: SeniorRequestStatus.Rejected,
//         reviewedBy: req.body.reviewedBy,
//       }
//     })
//     await axios.patch("https://metro-user.vercel.app/api/user/", { "id": updated.userId, "isSenior": false   });
//     res.status(200).json({
//       status: `Successfully rejected : ${id}`,
//       newDocument: updated
//     })
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// }

export default {
  getAllSeniorRequests,
  //rejectSeniorRequest,
  //approveSeniorRequest

};


