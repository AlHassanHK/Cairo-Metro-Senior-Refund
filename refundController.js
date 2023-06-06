import { PrismaClient } from "@prisma/client";

//Database enums, user RideStatus.pending for example
import { UserRole } from "@prisma/client";
import { RouteId } from "@prisma/client";
import { RefundRequestStatus } from "@prisma/client";
import email from "./email.js";

const prisma = new PrismaClient();

const refundRequests = prisma.RefundRequest;
const user = prisma.User;



const getAllRefundRequests = async (req, res) => {
    try {
        const allRefundRequests = await refundRequests.findMany({});
        res.status(200).json(allRefundRequests);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const approveRefundRequest = async (req, res) =>{
  try {
    const id = req.body.id;
    const updated = await refundRequests.update({
      where: {
        id: id
      },
      data: {
        status: RefundRequestStatus.Approved,
        reviewedBy: req.body.reviewedBy,
        
      },include:{
        trip:{
          include:{
            user:true
          }
        },
      }
    })
    const trip = updated.trip;
    const totalPrice = trip.totalPrice;
    email.sendEmail(updated.trip.user.email, id, RefundRequestStatus.Approved, totalPrice);
    res.status(200).json({
      status: `Successfully approved : ${id}`,
      newDocument: updated
    })
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const rejectRefundRequest = async(req, res)=>{
  try {
    const id = req.body.id;
    const updated = await refundRequests.update({
      where: {
        id: id
      },
      data: {
        status: RefundRequestStatus.Rejected,
        reviewedBy: req.body.reviewedBy,
        
      },include:{
        trip:{
          include:{
            user:true
          }
        },
      }
    })
    const totalPrice = "None";
    email.sendEmail(updated.trip.user.email, id, RefundRequestStatus.Rejected, totalPrice);
    res.status(200).json({
      status: `Successfully rejected : ${id}`,
      newDocument: updated
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export default {
  getAllRefundRequests,
  approveRefundRequest,
  rejectRefundRequest
};




















// const approveOrRejectRefundRequest = async (req, res) => {
//     try {
//       const seniorRequestStatus = req.params.status;
  
//       const id = req.body.id;
//       if (seniorRequestStatus.toLowerCase() === "approve") {
//         const updated = await seniorRequests.update({
//           where: {
//             id: id
//           },
//           data: {
//             status: SeniorRequestStatus.Approved,
//             reviewedBy: req.body.reviewedBy,
//           }
//         })
//         res.status(200).json({
//           status: `Successfully approved : ${id}`,
//           newDocument: updated
//         })
//       }
//       else if (seniorRequestStatus.toLowerCase() === "reject") {
//         const updated = await seniorRequests.update({
//           where: {
//             id: id
//           },
//           data: {
//             status: SeniorRequestStatus.Rejected,
//             reviewedBy: req.body.reviewedBy,
//           }
//         })
//         res.status(200).json({
//           status: `Successfully rejected : ${id}`,
//           newDocument: updated
//         })
//       }
//     } catch (error) {
//       res.status(400).send(error.message);
//     }
//   }